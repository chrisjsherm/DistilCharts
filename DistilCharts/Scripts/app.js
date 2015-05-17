$(document).foundation();

$(function () {
    var data,
        categories = [],
        human = [],
        good = [],
        bad = [],
        whitelist = [];

    $.getJSON('/data/data.json')
        .done(function (data) {
            $.each(data.categorized_domain_requests, function (index, value) {
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
    });

    var frm = document.getElementById('dynamicAdd');

    frm.addEventListener('submit', plotPoint);

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
});
