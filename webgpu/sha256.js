import { sha256Shader } from './sha256shader.js';

export const sha256 = async (inputArray) => {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) { return; }
    const device = await adapter.requestDevice();

    const fromHexString = (hexString) => Uint32Array.from((hexString.match(/.{1,2}/g) || []).map(byte => parseInt(byte, 16)));

    const toHexString = (byteArray) => Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('');

    const hexString = toHexString(inputArray);
    const firstMatrix = fromHexString(hexString);

    const gpuBufferFirstMatrix = device.createBuffer({
        mappedAtCreation: true,
        size: firstMatrix.byteLength,
        usage: GPUBufferUsage.STORAGE,
    });
    const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();
    new Int32Array(arrayBufferFirstMatrix).set(firstMatrix);
    gpuBufferFirstMatrix.unmap();

    const size = new Uint32Array([firstMatrix.length]);
    const gpuBufferSize = device.createBuffer({
        mappedAtCreation: true,
        size: Int32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE,
    });
    const arrayBufferSize = gpuBufferSize.getMappedRange();
    new Int32Array(arrayBufferSize).set(size);
    gpuBufferSize.unmap();

    const resultMatrixBufferSize = Uint32Array.BYTES_PER_ELEMENT * 32;
    const resultMatrixBuffer = device.createBuffer({
        size: resultMatrixBufferSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
            { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
            { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } }
        ]
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: gpuBufferFirstMatrix } },
            { binding: 1, resource: { buffer: gpuBufferSize } },
            { binding: 2, resource: { buffer: resultMatrixBuffer } }
        ]
    });

    const shaderModule = device.createShaderModule({ code: sha256Shader });

    const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
        compute: { module: shaderModule, entryPoint: "main" }
    });

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(1, 1);
    passEncoder.end();

    const gpuReadBuffer = device.createBuffer({
        size: resultMatrixBufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(resultMatrixBuffer, 0, gpuReadBuffer, 0, resultMatrixBufferSize);
    const gpuCommands = commandEncoder.finish();

    // Start precise timing here
    const start = performance.now();

    device.queue.submit([gpuCommands]);

    await gpuReadBuffer.mapAsync(GPUMapMode.READ);
    const arrayBuffer = gpuReadBuffer.getMappedRange();

    const end = performance.now();
    console.log(`WebGPU SHA-256 time: ${(end - start).toFixed(5)} ms`);

    let str = "";
    for (let value of Array.from(new Uint32Array(arrayBuffer))) {
        str += value.toString(16);
    }
    return str;
};
