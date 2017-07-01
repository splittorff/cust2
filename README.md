# cust2
a command prompt interface a backend db

The challenge was to make this: (translation coming....)

 
En commandline/rest baseret kundedatabase
 
Opgaven består af to afdelinger
Et rest api. Brug her fx express + mongoose
Command line. Brug her fx commander (https://www.npmjs.com/package/commander)
 
Man tilgår systemet igennem en kommando, herefter kaldt  "cust" (eller hvad du vil).
 
Flg. kommandoer skal implementeres
cust register <username><password>
Registrerer en bruger
cust login <username> <password>
Logger ind
 
Flg. kommandoer skal man være logget ind for at benytte
 
cust new <name> <email> <phone>
Opretter en ny kunde
cust list   
lister alle kunder
cust search <str>
Søger kunder hvis navn eller e-mail er indeholdt i <str>
 
Så man kan benytter programmet som følger:
 
c:>cust login navn password
c:>cust list
