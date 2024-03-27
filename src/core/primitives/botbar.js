// Drawing botbar with CanvasJS

import Const from '../../stuff/constants.js'
import Utils from '../../stuff/utils.js'

const {
    MINUTE15, MINUTE, HOUR,
    DAY, WEEK, MONTH, YEAR,
    MONTHMAP, HPX
} = Const


function body(props, layout, ctx) {
    const width = layout.botbar.width
    const height = layout.botbar.height

    const sb0 = layout.main.sbMax[0]
    const sb1 = layout.main.sbMax[1]

    ctx.font = props.config.FONT
    ctx.clearRect(0, 0, width, height)

    ctx.strokeStyle = props.colors.scale

    ctx.beginPath()
    ctx.moveTo(0, 0.5)
    ctx.lineTo(Math.floor(width + 1), 0.5)
    ctx.stroke()

    ctx.fillStyle = props.colors.text
    ctx.beginPath()



    for (var p of layout.botbar.xs) {
        let lbl = formatDate(props, p)
        let x = p[0] + sb0
        //if (p[0] - sb0 > width - sb1) continue

        ctx.moveTo(x + HPX, 0)
        ctx.lineTo(x + HPX, 4.5)

        if (!lblHighlight(props, p[1][0])) {
            ctx.globalAlpha = 0.85
        }
        ctx.textAlign = 'center'
        ctx.fillText(lbl, x, 18)
        ctx.globalAlpha = 1

    }

    ctx.stroke()

}

function panel(props, layout, ctx) {

    let lbl = formatCursorX(props)
    ctx.fillStyle = props.colors.panel

    let measure = ctx.measureText(lbl + '    ')
    let panwidth = Math.floor(measure.width + 10)
    let cursor = props.cursor.x + layout.main.sbMax[0]
    let x = Math.floor(cursor - panwidth * 0.5)
    let y = 1
    // TODO: limit panel movement
    //let w = layout.botbar.width - layout.main.sbMax[1]
    //x = Math.min(x, w - panwidth)
    let panheight = props.config.PANHEIGHT
    //ctx.fillRect(x, y, panwidth, panheight + 0.5)
    roundRect(ctx, x, y, panwidth, panheight + 0.5, 3)

    ctx.fillStyle = props.colors.textHL
    ctx.textAlign = 'center'
    ctx.fillText(lbl, cursor, y + 16)

}

function formatDate(props, p) {
    let t = p[1]
    let tf = props.timeFrame

    let k = tf < DAY ? 1 : 0
    let tZ = t + k * HOUR

    //t += new Date(t).getTimezoneOffset() * MINUTE
    let d = new Date(t)

    if (p[2] === YEAR || Utils.yearStart(t) === t) {
        return d.getFullYear()
    }
    if (p[2] === MONTH || Utils.monthStart(t) === t) {
        return MONTHMAP[d.getMonth()]
    }
    // TODO(*) see gridMaker.js
    if (Utils.dayStart(t) === t) return d.getDate()


    const h = Utils.addZero(d.getHours())
    const m = Utils.addZero(d.getMinutes())

    return h + ":" + m
}


function formatCursorX(props) {
    let t = props.cursor.time

    if (t === undefined || isNaN(t)) return `Out of range`
    // TODO: IMPLEMENT TI

    let tf = props.timeFrame

    // Enable timezones only for tf < 1D
    let k = tf < DAY ? 1 : 0

    //t += new Date(t).getTimezoneOffset() * MINUTE
    let d = new Date(t)

    if (tf === YEAR) {
        return d.getFullYear()
    }

    if (tf < YEAR) {
        var yr = "'" + `${d.getFullYear()}`.slice(-2)
        var mo = MONTHMAP[d.getMonth()]
        var dd = '01'
    }

    if (tf <= WEEK) dd = d.getDate()
    let date = `${dd} ${mo} ${yr}`
    let time = ''

    if (tf < DAY) {
        const h = Utils.addZero(d.getHours())
        const m = Utils.addZero(d.getMinutes())

        time = h + ":" + m
    }

    return `${date} ${time}`

}

// Highlights the begining of a time interval
// TODO: improve. Problem: let's say we have a new month,
// but if there is no grid line in place, there
// will be no month name on t-axis. Sad.
// Solution: manipulate the grid, skew it, you know
function lblHighlight(props, t) {

    let tf = props.timeFrame

    if (t === 0) return true
    if (Utils.monthStart(t) === t) return true
    if (Utils.dayStart(t) === t) return true
    if (tf <= MINUTE15 && t % HOUR === 0) return true

    return false

}

function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    ctx.beginPath()
    ctx.moveTo(x+r, y)
    ctx.arcTo(x+w, y,   x+w, y+h, 0)
    ctx.arcTo(x+w, y+h, x,   y+h, r)
    ctx.arcTo(x,   y+h, x,   y,   r)
    ctx.arcTo(x,   y,   x+w, y,   0)
    ctx.closePath()
    ctx.fill()
}

export default {
    body,
    panel
}
