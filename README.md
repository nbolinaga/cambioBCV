API hosteada en 'https://rapidapi.com/nbolinaga18/api/cambiobcv1'  
Pueden copiarla si quieren hostear su propia.  

TO-DO:  
> Cambiar Strings a Ints  
> Que cada valor tenga su getter  
> Cambios paralelos  

```
endpoint "/"
{
    "fecha": String,
    "dolar": String,
    "euro": String,
    "yuan": String,
    "lira": String,
    "rublo": String
}

endpoint "/historico"
[
...
{
    "fecha": String,
    "dolar": String,
    "euro": String,
    "yuan": String,
    "lira": String,
    "rublo": String
},
{
    "fecha": String,
    "dolar": String,
    "euro": String,
    "yuan": String,
    "lira": String,
    "rublo": String
},
{
    "fecha": String,
    "dolar": String,
    "euro": String,
    "yuan": String,
    "lira": String,
    "rublo": String
}
...
]
```
