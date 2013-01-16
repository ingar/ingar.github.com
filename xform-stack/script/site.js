$(function() {
  $('#xforms').on('click', 'a.add', function() {
    var $xform = $(this).parent('.xform').clone().removeClass('template')
    $('input', $xform).prop('disabled', false);
    $('#xform-stack').append($xform);
  });

  $('#xform-stack').sortable();

  $('#xform-stack').on('keyup change', 'input', function(e) {
    render();
  });

  $('#xform-stack').on('click', 'a.remove', function(e) {
    $(this).closest('.xform').remove();
    render();
  });

  $('#xform-stack').on('sortstop', function(e) {
    render();
  });

  $('#draw-intermediate').on('change', function(e) {
    render();
  });

  var canvas = document.getElementById('main-canvas');
  var ctx = window.dbgctx = canvas.getContext('2d');
  var canvasWidth = 800;
  var canvasHeight = 400;

  var transforms = {
    translate: function(el) {
      var x = parseFloat($('[name="x"]', el).val()) || 0;
      var y = parseFloat($('[name="y"]', el).val()) || 0;
      ctx.translate(x, y);
    },
    scale: function(el) {
      var x = parseFloat($('[name="x"]', el).val()) || 1;
      var y = parseFloat($('[name="y"]', el).val()) || 1;
      ctx.scale(x, y);
    },
    rotate: function(el) {
      var d = parseFloat($('[name="degrees"]', el).val()) || 0;
      ctx.rotate(d * (2 * Math.PI / 360));
    }
  };

  function drawModel(opacity) {
    var points = [
      [0, 4],
      [3, 4],
      [3, 3],
      [1, 3],
      [1, 2],
      [2, 2],
      [2, 1],
      [1, 1],
      [1, 0],
      [0, 0]
    ];

    ctx.save();
    ctx.lineWidth = 0.1;
    ctx.fillStyle = 'rgba(255,0,0,' + (opacity || 1.0) + ')';
    ctx.scale(10, 10);
    ctx.translate(-1.5, -2);
    ctx.beginPath();
    points.forEach(function(point) {
      ctx.lineTo.apply(ctx, point);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawAxes() {
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();
    ctx.restore();
  }

  function setupCoordinateSystem() {
    ctx.scale(1, -1);
    ctx.translate(canvasWidth / 2, -canvasHeight / 2);
  }

  function clearCanvas() {
    // Hack to clear canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  var render = function() {
    console.log("Begin Render");
    var drawIntermediate = $('#draw-intermediate').is(':checked');
    clearCanvas();

    ctx.save();
    drawAxes();
    setupCoordinateSystem();

    var $xforms = $('#xform-stack li');
    console.log($xforms);
    $xforms.each(function() {
      var xform = $(this).data('xform');

      // Need this check for jQuery sortable, sometimes we get the placeholder
      if (xform) {
        transforms[$(this).data('xform')](this);
        if (drawIntermediate) {
          drawModel(0.5);
        }
      }
    });
    drawModel();
    ctx.restore();
  };

  render();
});
