UNIT = 100
DIMENSIONS = { x: UNIT * 6, y: UNIT * 6 }

THETA_RANGE = { min: Math.PI * -.75, max: Math.PI * .75 }

STROKE_COLOR = 0
STROKE_WEIGHT = 2.5

TEXT_SIZE = UNIT * .15

let center
let theta = 0
let dTheta = 0
let easing = 0.15

let font
let fontBold

function preload() {
  font = loadFont("assets/Sniglet-Regular.ttf");
  fontBold = loadFont("assets/Sniglet-ExtraBold.ttf");
}

function setup() {
  createCanvas(DIMENSIONS.x, DIMENSIONS.y)
  flex({
    container: { padding: "3rem" },
    canvas: {
      fit: CONTAIN
    }
  })

  colorMode(HSB)

  center = {
    x: width / 2,
    y: height / 2
  }

  textAlign(CENTER, CENTER)
  rectMode(CENTER)

  noCursor()
}

function draw() {
  background(255)

  // draw the background elements
  let hue = mapThetaToHue(theta)

  stroke(STROKE_COLOR)
  strokeWeight(STROKE_WEIGHT)

  drawingContext.setLineDash([7.99]);
  fill(color(hue, 10, 100))
  translate(center.x, center.y)
  rotate(-theta * .1)
  ellipse(0, 0, UNIT * 3)
  rotate(theta * .1)
  translate(-center.x, -center.y)

  drawingContext.setLineDash([1]);
  arc(center.x, center.y, UNIT * 2.5, UNIT * 2.5, THETA_RANGE.min + PI * 2.5, THETA_RANGE.max + PI * .5)

  // calculate the position of the dots the dots
  hopelessDotPos = getArcPosFromTargetTheta(center.x, center.y, THETA_RANGE.min, UNIT * 2.5)
  unknowingDotPos = getArcPosFromTargetTheta(center.x, center.y, 0, UNIT * 2.5)
  hopefulDotPos = getArcPosFromTargetTheta(center.x, center.y, THETA_RANGE.max, UNIT * 2.5)

  // style and draw the titles
  fill(0)
  noStroke()
  textFont(fontBold)
  textSize(TEXT_SIZE * 1.75)
  titleStrokeProps = {
    hueStart: 40 + theta * 15,
    hueEnd: 80 + theta * 15,
    saturation: 60,
    brightness: 100,
    weight: 3
  }
  drawTextAboveCircle('WHERE DO YOU FIND YOURSELF TODAY?', UNIT * 2.25, .03 - theta * .02, titleStrokeProps)
  drawTextBelowCircle('DOES YOUR SPIRITUAL PRACTICE HOLD IT?', UNIT * 2.2, -.06 - theta * .02, titleStrokeProps)

  // style and draw the expressions in the middle
  textFont(font)
  textSize(TEXT_SIZE)
  noStroke()
  let currentExpression = getExpression(theta)
  text(currentExpression, center.x, center.y, UNIT * 1.5)

  // style and draw the indicator dot
  indicatorDotPos = getArcPosFromTargetPos(center.x, center.y, mouseX, mouseY, UNIT * 2.5, THETA_RANGE.min, THETA_RANGE.max)
  fill(color(hue, 60, 100))
  stroke(0)
  indicatorDotRadius = UNIT * .2 - constrain(abs((dTheta * 10)), 0, UNIT * .1)
  ellipse(indicatorDotPos.x, indicatorDotPos.y, indicatorDotRadius)

  noStroke()
  fill(0)

  // style and draw the texts around the circle
  strokeWeight(STROKE_WEIGHT)
  if (theta < THETA_RANGE.min + .05) {
    stroke(0, 60, 100)
    drawTextAboveCircle('hopeless', UNIT * 1.7, -.735)
    stroke(0)
    fill(0, 60, 100)
    ellipse(hopelessDotPos.x, hopelessDotPos.y, UNIT * .09)
  } else {
    fill(0)
    noStroke()
    drawTextAboveCircle('hopeless', UNIT * 1.7, -.735)
    stroke(0)
    ellipse(hopelessDotPos.x, hopelessDotPos.y, UNIT * .09)
  }

  if (theta < .05 && theta > -.05) {
    stroke(60, 60, 100)
    drawTextBelowCircle('unknowing', UNIT * 1.64, -.03)
    stroke(0)
    fill(60, 60, 100)
    ellipse(unknowingDotPos.x, unknowingDotPos.y, UNIT * .09)
  } else {
    fill(0)
    noStroke()
    drawTextBelowCircle('unknowing', UNIT * 1.64, -.03)
    stroke(0)
    ellipse(unknowingDotPos.x, unknowingDotPos.y, UNIT * .09)
  }

  if (theta > THETA_RANGE.max - .05) {
    stroke(120, 60, 100)
    drawTextAboveCircle('hopeful', UNIT * 1.7, .765)
    stroke(0)
    fill(120, 60, 100)
    ellipse(hopefulDotPos.x, hopefulDotPos.y, UNIT * .09)
  } else {
    fill(0)
    noStroke()
    drawTextAboveCircle('hopeful', UNIT * 1.7, .765)
    stroke(0)
    ellipse(hopefulDotPos.x, hopefulDotPos.y, UNIT * .09)
  }

  drawCursor()
}

function getArcPosFromTargetPos(centerX, centerY, targetX, targetY, d, thetaMin, thetaMax) {
  let relativeX = targetX - centerX;
  let relativeY = targetY - centerY;

  let targetTheta = Math.atan2(relativeX, relativeY)

  targetTheta = constrain(targetTheta, thetaMin, thetaMax)

  dTheta = targetTheta - theta;
  dTheta = constrain(dTheta, -1, 1)
  theta += dTheta * easing;

  let offsetX = sin(theta) * d / 2
  let offsetY = cos(theta) * d / 2
  return { x: centerX + offsetX, y: centerY + offsetY }
}

function getArcPosFromTargetTheta(centerX, centerY, targetTheta, d) {
  let offsetX = sin(targetTheta) * d / 2
  let offsetY = cos(targetTheta) * d / 2
  return { x: centerX + offsetX, y: centerY + offsetY }
}

function drawCursor() {
  fill(0)
  noStroke()
  ellipse(mouseX, mouseY, UNIT * .06, UNIT * .06)
}

function mapThetaToHue(theta) {
  return hue = map(theta, -PI * .75, PI * .75, 0, 120)
}

function drawTextAboveCircle(textString, radius, angleOffset, strokeProps = undefined) {
  let textRadius = radius - TEXT_SIZE
  let currentAngle = Math.PI - (textWidth(textString) / 2) / textRadius + angleOffset;

  for (let i = -1; i < textString.length; i++) {
    let charWidth = textWidth(textString.charAt(i));
    let nextCharWidth = textWidth(textString.charAt(i + 1 || i));

    push();
    translate(center.x, center.y)
    rotate(currentAngle);
    translate(0, textRadius + TEXT_SIZE);
    rotate(Math.PI)

    if (strokeProps !== undefined) {
      stroke(map(i, 0, textString.length - 1, strokeProps.hueStart, strokeProps.hueEnd), strokeProps.saturation, strokeProps.brightness)
      strokeWeight(strokeProps.weight)
    }
    fill(0)
    text(textString.charAt(i), 0, 0);
    pop();

    currentAngle += (charWidth + nextCharWidth) / 2 / textRadius;
  }
}

function drawTextBelowCircle(textString, radius, angleOffset, strokeProps = undefined) {
  let textRadius = radius - TEXT_SIZE * .5
  currentAngle = (textWidth(textString) / 2) / textRadius + angleOffset;

  for (let i = -1; i < textString.length; i++) {
    let charWidth = textWidth(textString.charAt(i));
    let nextCharWidth = textWidth(textString.charAt(i + 1 || i));

    push();
    translate(center.x, center.y)
    rotate(currentAngle);
    translate(0, textRadius + TEXT_SIZE * .5);

    if (strokeProps !== undefined) {
      stroke(map(i, 0, textString.length - 1, strokeProps.hueStart, strokeProps.hueEnd), strokeProps.saturation, strokeProps.brightness)
      strokeWeight(strokeProps.weight)
    }
    fill(0)
    text(textString.charAt(i), 0, 0);
    pop();

    currentAngle -= (charWidth + nextCharWidth) / 2 / textRadius;
  }
}

function getExpression(theta) {
  let i = round(map(theta, THETA_RANGE.min, THETA_RANGE.max, 0, expressions.length - 1))
  return expressions[i]
}