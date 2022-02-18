const shadow = (name: string): Elevation.Shadow => `var(--elev-${name})`

const Elevation = {
    Ground: shadow('ground'),
    Stratus: shadow('stratus'),
    Cumulus: shadow('cumulus'),
    Cirrus: shadow('cirrus'),
}

module Elevation {
    export type Shadow = string
}

export default Elevation
