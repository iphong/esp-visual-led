# Protocol Reference

## General message rules

Communication focuses on speed and timing, therefore short messages are sent out so that all nodes can received at once. Then each node should determine whether if it should ignore or process it.

Send from master to all slaves
```
#>MSG...
```

Send from master to slave id "XXXXXX"
```
XXXXXX>MSG
```

Send from slave id "XXXXXX" to master
```
XXXXXX<MSG
```
All messages below will follow the above rule, for example:
```
#>BLINK
22BAE7>BLINK
22BAE7<SELECT
```

## Messages

* PING
* PAIR
* SYNC
* FILE
* NAME
* SET
* DIM
* BLINK
* SELECT
* BEGIN
* PAUSE
* RESUME
* TOGGLE
* END
* RESET
* WIFI
