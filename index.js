const express = require('express')
const bodyParser = require('body-parser')
const url = require('url');
const app = express()
const axios = require('axios')
const {
    Heap
} = require('heap-js');
var graph = require('./data/graph.json');
const {
    start
} = require('repl');
var distance = require('euclidean-distance')

const port = 3000
app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('map');
})

app.post('/getpath', async (req, res) => {
    var start_la = req.body.start_la;
    var start_lo = req.body.start_lo;
    var end_la = req.body.end_la
    var end_lo = req.body.end_lo;
    // console.log(req.body);
    var inds = getNearestNode(start_la, start_lo);
    var inde = getNearestNode(end_la, end_lo);
    console.log(inds);
    console.log(inde);
    start_la = graph[inds].la;
    start_lo = graph[inds].lo;


    end_la = graph[inde].la;
    end_lo = graph[inde].lo;

    path = getSafestPath(inds, inde);

    res.send(path);
})

function getSafestPath(inds, inde) {
    newgraph = generateWeight(graph);
    const customPriorityComparator = (a, b) => a.dist - b.dist;
    var parent = new Array(6000).fill(-1);
    var dist = new Array(6000).fill(1000000000000);
    const pq = new Heap(customPriorityComparator);
    var start = inds;
    pq.push({
        'dist': 0,
        'i': start
    });
    dist[start] = 0;
    while (!pq.isEmpty()) {
        var top = pq.top()[0].i;
        pq.pop();
        for (var i = 0; i < Object.keys(newgraph[top]).length; i++) {
            var child = newgraph[top][i].i;

            if (dist[child] > dist[top] + newgraph[top][i].w) {
                dist[child] = dist[top] + newgraph[top][i].w;
                pq.push({
                    'dist': dist[child],
                    'i': child
                })
                parent[child] = top;
            }
        }

    }

    // Generate Safest Path from parents array
    var finalpath = [];
    var curr = inde;
    finalpath.push(curr);
    while (parent[curr] != -1) {
        curr = parent[curr];
        finalpath.push(curr);
    }
    finalpath.reverse();
    console.log(finalpath);
    return finalpath;
}


function generateWeight(g) {
    // console.log(g);
    var newGraph = [];
    lambda = 0.01 // Change this accordingly
    for (var i = 0; i < Object.keys(g).length; i++) {
        var adjlist = [];
        var child = g[i].e;
        for (var j = 0; j < Object.keys(child).length; j++) {
            adjlist.push({
                'i': child[j].i,
                'w': lambda * child[j].w + 0 //Write the risk factor here 
            })
        }
        newGraph.push(adjlist);
    }

    return newGraph;
}


function getNearestNode(lo, la) {
    var mn_dist = 10000000000.0;
    var ind = null;
    for (var i = 0; i < graph.length; i++) {
        var g = graph[i];
        // console.log(lo);
        var sum = getDistanceFromLatLonInKm(g.la, g.lo, la, lo);
        
        if (sum < mn_dist) {
            mn_dist = sum;
            ind = i;
        }
        console.log(mn_dist);
    }
    return ind;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
} 