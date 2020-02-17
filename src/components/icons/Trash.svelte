<script lang="ts">
  export let color: string = "#000";
  export let fill: string = "";
  export let fillOpacity = 0;
  export let size = 30;
</script>

<svg
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  preserveAspectRatio="xMidYMid meet"
  viewBox="145 180 355 375"
  style="height: {size}px; width: {size}px">
  <defs>
    <path d="M320 335L320 480" id="e5GIJXrT6" />
    <path d="M250 480L250 335" id="aAqejRBFk" />
    <path
      d="M443.9 265.99C448.07 265.99 451.45 269.37 451.45 273.55C451.45 327.49
      451.45 481.78 451.45 535.73C451.45 539.91 448.07 543.29 443.9
      543.29C392.83 543.29 247.17 543.29 196.1 543.29C191.93 543.29 188.55
      539.91 188.55 535.73C188.55 481.78 188.55 327.49 188.55 273.55C188.55
      269.37 191.93 265.99 196.1 265.99C247.17 265.99 392.83 265.99 443.9
      265.99Z"
      id="a1xS0VG1r4" />
    <path d="M390 480L390 335" id="a52ayBwppW" />
    <path
      d="M356.45 192.31C361.98 192.31 366.45 196.79 366.45 202.31C366.45 215.64
      366.45 245.65 366.45 258.99C366.45 264.51 361.98 268.99 356.45
      268.99C341.26 268.99 305.66 268.99 290.47 268.99C284.94 268.99 280.47
      264.51 280.47 258.99C280.47 245.65 280.47 215.64 280.47 202.31C280.47
      196.79 284.94 192.31 290.47 192.31C305.66 192.31 341.26 192.31 356.45
      192.31Z"
      id="f1sMhzRAK" />
    <clipPath id="clipb3XthvVPkn">
      <use xlink:href="#f1sMhzRAK" opacity="1" />
    </clipPath>
    <path d="M490 265.99L150 265.99" id="b7jWQSkXN" />
  </defs>
  <g>
    <g>
      <g>
        <g>
          <use
            xlink:href="#e5GIJXrT6"
            opacity="1"
            {fill}
            fill-opacity={fillOpacity}
            stroke={color}
            stroke-width="30"
            stroke-opacity="1" />
        </g>
      </g>
      <g>
        <g>
          <use
            xlink:href="#aAqejRBFk"
            opacity="1"
            {fill}
            fill-opacity={fillOpacity}
            stroke={color}
            stroke-width="30"
            stroke-opacity="1" />
        </g>
      </g>
      <g>
        <g>
          <use
            xlink:href="#a1xS0VG1r4"
            opacity="1"
            {fill}
            fill-opacity={fillOpacity}
            stroke={color}
            stroke-width="30"
            stroke-opacity="1" />
        </g>
      </g>
      <g>
        <g>
          <use
            xlink:href="#a52ayBwppW"
            opacity="1"
            {fill}
            fill-opacity={fillOpacity}
            stroke={color}
            stroke-width="30"
            stroke-opacity="1" />
        </g>
      </g>
      <g>
        <g clip-path="url(#clipb3XthvVPkn)">
          <use
            xlink:href="#f1sMhzRAK"
            opacity="1"
            {fill}
            fill-opacity={fillOpacity}
            stroke={color}
            stroke-width="30"
            stroke-opacity="1" />
        </g>
      </g>
      <g>
        <g>
          <use
            xlink:href="#b7jWQSkXN"
            opacity="1"
            {fill}
            fill-opacity={fillOpacity}
            stroke={color}
            stroke-width="30"
            stroke-opacity="1" />
        </g>
      </g>
    </g>
  </g>
</svg>
