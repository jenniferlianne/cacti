COUNT=0
TOTAL=1

# FABRIC2 - FABRIC1
./bin/fabric-cli asset exchange-all --network1=network1 --network2=network2 --secret=secrettext --timeout-duration=100 bob:bond01:a04:alice:token1:100 &> tmp.out
tail -n 2 tmp.out | grep "Asset Exchange Complete." && COUNT=$(( COUNT + 1 )) && echo "PASS"
cat tmp.out

# RESULT
echo "Passed $COUNT/$TOTAL Tests."

if [ $COUNT == $TOTAL ]; then
    exit 0
else
    exit 1
fi
