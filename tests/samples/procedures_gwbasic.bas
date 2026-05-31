10 REM Procedures sample in GW-BASIC (no SUB/FUNCTION — use GOSUB)
20 X = 4
30 GOSUB 100
40 PRINT "Result: "; X
50 END
100 REM "Double" subroutine
110 X = X * 2
120 RETURN
