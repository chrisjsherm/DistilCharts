(function () {
    var data,
        categories = [],
        frm = document.getElementById('dynamicAdd'),
        human = [],
        good = [],
        bad = [],
        whitelist = [];

    // Listen for form submit.
    frm.addEventListener('submit', plotPoint);

    // Get chart data, then set up chart.
    getJSON('/data/data.json').then(function (data) {
        data.categorized_domain_requests.forEach(function (value) {
            categories.push(value.summary_date);
            human.push(value.human_total);
            good.push(value.good_bot_total);
            bad.push(value.bad_bot_total);
            whitelist.push(value.whitelist_total);
        });

        $('#container').highcharts({
            title: {
                text: 'Web requests',
                x: -20 //center
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Requests'
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Human',
                data: human
            }, {
                name: 'Good',
                data: good
            }, {
                name: 'Bad',
                data: bad
            }, {
                name: 'Whitelist',
                data: whitelist
            }]
        });

        frm.className = '';
    });

    function get(url) {
        // Return a new promise.
        return new Promise(function (resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function () {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function () {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    }

    function getJSON(url) {
        return get(url).then(JSON.parse);
    }

    function plotPoint(e) {
        var date,
            numRequests,
            series;

        // Prevent form submitting.
        e.preventDefault();

        date = e.target.elements["date"].value;
        numRequests = parseInt(e.target.elements["requests"].value, 10);
        series = parseInt(e.target.elements["series"].value, 10);

        // Add new point.
        $('#container').highcharts().series[series].addPoint([date, numRequests]);
    }
}());
