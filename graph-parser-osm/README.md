# osm-graph-parser

Java program that parses OSM XML files into a json graph representation. 

### How to run
- Java Runtime Environment needed. Instructions to download can be found [here](https://ubuntu.com/tutorials/install-jre#1-overview).

- From the link choose `Linux x64 Compressed Archive (jre-8u291-linux-x64.tar.gz)` to download on step 3 (or change according to your need).

- Download data (.osm file) of the respective area from [OpenStreetMap](https://www.openstreetmap.org/). (Export->Select Area->Export)

- Note: The downloaded .osm file should be in the parent directory (same as jar file).

- Change & run the following command on terminal:
```
java -jar <jar-file-name>.jar -f files -i selected ways -o output file name
```

Command used for this project: 
```
java -jar osmparser-0.13.jar -f map.osm -i highway -o graph.json
```

## Overview of Json file

In output file you will have nodes and edges with weight (unit: `centimetres`).
```json
[
  {
    "la": 60.1570875,
    "lo": 24.9563234,
    "e": [
      {
        "i": 1,
        "w": 514
      },
      {
        "i": 17,
        "w": 574
      }
    ]
  },
  {
    "la": 60.1570488,
    "lo": 24.9562727,
    "e": [
      {
        "i": 0,
        "w": 514
      },
      {
        "i": 2,
        "w": 784
      },
      {
        "i": 11302,
        "w": 413
      }
    ]
  }
 ]
 ```
 
 ### How to read that json
 ```
 la = latitude
 lo = longitude
 e = edges
 i = main array index, if the i is 0 it refers to the first element in the array
 w = weight
 ```

 ### Command-line flags

```
-f, --files           osm files to be parsed
-i, --includeWays     way tags to include
-e, --excludeWays     way tags to exclude (overrides includeWay)
-o, --output          output file name
-q, --quiet           suppress console output
```

### Possible errors

1. Parsing take much time or program crash.
    - The program does not have enought memory. Use `-Xmx` flag with java. Example run command `java -jar -Xmx4096m <jar-file-name>.jar`. That will increase java heap max size to 4gb. You will need 4gb ram for that. 

## Built With

* [Gradle](https://gradle.org) - Dependency Management

## Reference

* GitHub link: [osm-graph-parser](https://github.com/rovaniemi/osm-graph-parser)