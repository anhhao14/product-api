#!/usr/bin/env bash
# Smoke test CRUD cho product-api
# Cách dùng: bash scripts/smoke-test.sh [BASE_URL]
set -e
BASE=${1:-http://localhost:3000}
J='Content-Type: application/json'

# check <mã mong đợi> <tham số curl...>
check() {
  expected=$1; shift
  code=$(curl -s -o /tmp/body -w "%{http_code}" "$@")
  echo "[$code] $(cat /tmp/body)"
  if [ "$code" != "$expected" ]; then
    echo "FAIL: mong doi $expected nhung nhan $code"; exit 1
  fi
}

check 200 $BASE/health
check 201 -X POST $BASE/products -H "$J" -d '{"pid":"CI001","pname":"CI Product","price":1000,"quantity":1}'
check 409 -X POST $BASE/products -H "$J" -d '{"pid":"CI001","pname":"Dup","price":1,"quantity":1}'
check 400 -X POST $BASE/products -H "$J" -d '{"pid":"CI002"}'
check 200 $BASE/products
check 200 $BASE/products/CI001
check 200 -X PUT $BASE/products/CI001 -H "$J" -d '{"price":2000}'
check 400 -X PUT $BASE/products/CI001 -H "$J" -d '{"price":"abc"}'
check 200 -X DELETE $BASE/products/CI001
check 404 $BASE/products/CI001
echo "PASS: tat ca test CRUD thanh cong"