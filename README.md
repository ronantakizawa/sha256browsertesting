# Testing SHA-256 Algorithms on the Browser (Browser APIs, Javascript Libraries, WASM, WebGPU)

# Final Results

WebCrypto API:
Data Size: 100000 - Hashing: 8.00000 ms - Throughput: 12.50 KB/s - Parallelism Time: 4.70000 ms
Data Size: 1000000 - Hashing: 58.00000 ms - Throughput: 17.24 KB/s - Parallelism Time: 41.90000 ms
Data Size: 10000000 - Hashing: 479.00000 ms - Throughput: 20.88 KB/s - Parallelism Time: 450.80000 ms

CryptoJS:
Data Size: 100000 - Hashing: 5.00000 ms - Throughput: 20.00 KB/s - Parallelism Time: 1.70000 ms
Data Size: 1000000 - Hashing: 17.00000 ms - Throughput: 58.82 KB/s - Parallelism Time: 17.20000 ms
Data Size: 10000000 - Hashing: 166.00000 ms - Throughput: 60.24 KB/s - Parallelism Time: 168.10000 ms

WASM:
Data Size: 100000 - Hashing: 3.00000 ms - Throughput: 33.33 KB/s - Parallelism Time: 0.50000 ms
Data Size: 1000000 - Hashing: 3.00000 ms - Throughput: 333.33 KB/s - Parallelism Time: 2.60000 ms
Data Size: 10000000 - Hashing: 27.00000 ms - Throughput: 370.37 KB/s - Parallelism Time: 26.60000 ms

WebGPU:
Data Size: 100000 - Hashing: 82.00000 ms - Throughput: 1.22 KB/s - Parallelism Time: 21.70000 ms
Data Size: 1000000 - Hashing: 728.00000 ms - Throughput: 1.37 KB/s - Parallelism Time: 261.00000 ms
Data Size: 10000000 - Hashing: 6871.00000 ms - Throughput: 1.46 KB/s - Parallelism Time: 2668.60000 ms
