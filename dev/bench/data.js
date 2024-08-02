window.BENCHMARK_DATA = {
  "lastUpdate": 1722625341158,
  "repoUrl": "https://github.com/jenniferlianne/cacti",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "aldousss.alvarez@gmail.com",
            "name": "aldousalvarez",
            "username": "aldousalvarez"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": false,
          "id": "fdce6b3222fbec1c0f05db41dd5b93fbc8a8939d",
          "message": "ci(connector-xdai): fix docker rate limit issues with openethereum image pull\n\nPrimary Changes\n----------------\n1. Migrated all the xdai connector tests to besu ledger\n   images that is being pulled from ghcr\n\nFixes #3413\n\nSigned-off-by: aldousalvarez <aldousss.alvarez@gmail.com>",
          "timestamp": "2024-08-01T10:57:28-07:00",
          "tree_id": "2fecc0a53a69a02fe88066a2239c35ccea8728a9",
          "url": "https://github.com/jenniferlianne/cacti/commit/fdce6b3222fbec1c0f05db41dd5b93fbc8a8939d"
        },
        "date": 1722625337548,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 580,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "177 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 359,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "181 samples"
          }
        ]
      }
    ]
  }
}