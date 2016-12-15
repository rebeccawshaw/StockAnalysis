var getStocks = function() {
    $.ajax({
        url: '/v1/stocks',
        type: 'POST',
        data: $("#stocks").serialize(),
        dataType: 'json',
        success: [
            function(data) {
                $("#results").empty();
                $('#results').append(
                    "<tr>" +
                    "<td>Symbol</td>" +
                    "<td>Year</td>" +
                    "<td>Month</td>" +
                    "<td>Open Average</td>" +
                    "<td>High Average</td>" +
                    "<td>Low Average</td>" +
                    "<td>Close Average</td>" +
                    "<td>Volume Average</td>" +
                    "</tr>"
                );
                data.forEach(function (result) {
                    let templ = _.template(
                        "<tr><td><%=result._id.symbol%></td> " +
                        "<td><%=result._id.year%></td>" +
                        "<td><%=result._id.month + 1%></td>" +
                        "<td><%=result.value.open_avg%></td>" +
                        "<td><%=result.value.high_avg%></td>" +
                        "<td><%=result.value.low_avg%></td>" +
                        "<td><%=result.value.close_avg%></td>" +
                        "<td><%=result.value.volume_avg%></td></tr>");
                    let data = templ({result: result});
                    $('#results').append(data);
                });
            }
        ],
        error: [
            function(error) {
                console.log(error);
            }
        ]
    });
};