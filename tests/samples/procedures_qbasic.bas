' Procedures sample in QBasic
DECLARE FUNCTION Doubled% (n%)

x% = 4
PRINT "Result: "; Doubled%(x%)
END

FUNCTION Doubled% (n%)
  Doubled% = n% * 2
END FUNCTION
