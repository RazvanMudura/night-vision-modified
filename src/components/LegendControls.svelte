<script>
// Legend control buttons

import { onMount } from 'svelte'
import Events from '../core/events.js'
import icons from '../assets/icons.json'

export let gridId // gridId
export let ov // Overlay
export let props // General props
export let height // Legend-line height

let events = Events.instance(props.id)

$:display = ov.settings.display !== false
$:state = display ? 'open' : 'closed'

$:eyeStyle = `
    background-image: url(${icons[state+'-eye']});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
    margin-right: 2px;
`

$:closeStyle = `
    background-image: url(${icons["close"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
    margin-right: 2px;
    color: white;
`


$:editStyle = `
    background-image: url(${icons["edit"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
    margin-right: 2px;
    color: white;
`



export function update() {
    display = ov.settings.display !== false
}


function onDisplayClick() {
    events.emitSpec('hub', 'display-overlay', {
        paneId: gridId,
        ovId: ov.id,
        flag: ov.settings.display === undefined ?
            false : ! ov.settings.display
    })
}

function onRemove() {
    events.emitSpec('indicator', 'remove', {
        name: ov.name
    })
}


function onEdit() {
    events.emitSpec('indicator', 'edit', {
        name: ov.name
    })
}


</script>
<style>
.nvjs-eye {
    width: 20px;
    height: 20px;
    float: right;
    margin-right: 2px;
    margin-left: 7px;
}
.nvjs-eye:hover {
    filter: brightness(1.25);
}

</style>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nvjs-eye" style={eyeStyle} on:click|stopPropagation={onDisplayClick}></div>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nvjs-eye" style={editStyle} on:click|stopPropagation={onEdit}></div>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nvjs-eye" style={closeStyle} on:click|stopPropagation={onRemove}></div>

