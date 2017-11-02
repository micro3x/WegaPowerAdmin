
setInterval(function () {
    $.get("/api/live", function (data) {
        var batv = data.batv | 0;
        var windv = data.windv | 0;
        var outA = data.outA | 0;
        var rpm = data.rpm | 0;

        $('#lv-batV').text((batv / 10) + " V");
        $('#lv-windV').text((windv / 10) + " V");
        $('#lv-windA').text((outA / 10) + " A");
        $('#lv-rpm').text(rpm + " RPM");
        $('#current-time').text(new Date(data.systemTime));
    })
}, 1500);

var connected = false;

function addStatusIcon(status = false, glyph, text) {
    var container = $('<div role="alert">').addClass('alert');
    if (status) { container.addClass('alert-success') } else { container.addClass('alert-danger') }
    var icon = $('<span aria-hidden="true">').addClass('glyphicon');
    if (status) { icon.addClass(glyph) } else { icon.addClass('glyphicon-exclamation-sign') }

    $('#status-icons')
        .append($('<div class="col-xs-6 col-md-3">')
            .append(container
                .append([icon,
                    $('<span class="sr-only">').text('Info:'),
                    ' ' + text
                ])));
}

addStatusIcon(true, "glyphicon-signal", "System Online");
addStatusIcon(false, "glyphicon-flash", "Controller Disconnected");
addStatusIcon(true, "glyphicon-time", '<span id="current-time">19:30</span>');