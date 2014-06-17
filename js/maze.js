var maze = (function maze() {
    var self = {};

    self.Point = function Point(x, y) {
        return { x: x, y: y };
    }


    function printGraph(graph) {
        for (var i = 0; i < graph.length; i++) {
            console.log();
            var row = "";
            for (var j = 0; j < graph[0].length; j++) {
                row += (!graph[i][j] ? " " : "x");
            }
            console.log(row);
        }

        console.log();
        console.log();
    }

    var directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];

    self.generateMaze = function generateMaze(start, end, w, h) {
        function set(val, p) {
            graph[p.y][p.x] = !val;
        }

        function get(p) {
            return !graph[p.y][p.x];
        }

        function validSpace(p) {
            if (p.x - 1 < 0 || p.x + 1 >= w) {
                return false;
            }
            if (p.y - 1 < 0 || p.y + 1 >= h) {
                return false;
            }
            return true;
//
            return !(graph[p.y] == undefined || graph[p.y][p.x] == undefined);
        }

        function getNeighbours(p) {
            var neighbours = [];
            for (var i = 0; i < directions.length; i++) {
                var dir = directions[i];
                var neighbour = self.Point(p.x + dir[0], p.y + dir[1]);

                if (validSpace(neighbour)) {
                    neighbours.push(neighbour);
                }

            }
            return neighbours;
        }

        function countOpenNeighbours(p) {
            var count = 0;
            var neighbours = getNeighbours(p);
            for (var i = 0; i < neighbours.length; i++) {
                if (get(neighbours[i])) {
                    count++;
                }
            }
            return count;
        }

        function canOpen(p) {
            return countOpenNeighbours(p) == 1;
        }

        function adjacent(a, b) {
            return Math.abs(a.y - b.y) + Math.abs(a.x - b.x) == 1;
        }

        var open = _.curry(set, [true]);
        var close = _.curry(set, [false]);

        // Build an empty maze
        var graph = [];
        for (var r = 0; r < h; r++) {
            var row = [];
            for (var c = 0; c < w; c++) {
                row.push(true);
            }
            graph.push(row);
        }

        // Generate good path
        var paths = [];
        paths.push(start);
        open(start);

        var currentPoint = start;

        while (!adjacent(currentPoint, end)) {
            var nextPoint = null;

            while (nextPoint == null) {
                var neighbours = getNeighbours(currentPoint);
                while (neighbours.length > 0) {
                    var index = randInt(0, neighbours.length);
                    var neighbour = neighbours[index];
                    if (canOpen(neighbour) || adjacent(neighbour, end)) {
                        nextPoint = neighbour;
                        break;
                    }
                    else {
                        // Remove this neighbour
                        neighbours.splice(index, 1);
                    }
                }

                if (nextPoint == null) {
                    currentPoint = paths[randInt(0, paths.length)];
                }
            }

            currentPoint = nextPoint;
            paths.push(nextPoint);
            open(nextPoint);
        }

        paths.push(end);
        open(end);

        return graph;
    }

    return self;
})();
