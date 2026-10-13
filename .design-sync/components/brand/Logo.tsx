import * as React from 'react'

export interface LogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /** Pixel size applied to both width and height. Defaults to 48. */
  size?: number
}

/**
 * Vanture brand mark — a hexagon enclosing a six-fold radial "V". The mark is
 * monochrome by design; strokes and fills use `currentColor`, so it inherits the
 * surrounding text color and adapts automatically across the light / dark tones.
 *
 * Geometry is the production `public/vanture-mark.svg` verbatim (the site serves
 * it as CMS media); only the hard-coded #1d1d1b was swapped for currentColor.
 *
 * @category Brand
 */
export function Logo({ size = 48, className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 227.3 197.41"
      width={size}
      height={size}
      role="img"
      aria-label="Vanture"
      className={className}
      {...props}
    >
      <polygon
        fill="none"
        stroke="currentColor"
        strokeWidth={12}
        strokeMiterlimit={10}
        points="167.01 6.28 60.29 6.28 6.93 98.7 60.29 191.13 167.01 191.13 220.38 98.7 167.01 6.28"
      />
      <g fill="currentColor" stroke="currentColor" strokeWidth={2} strokeMiterlimit={10}>
        <path d="M145.74,186.13l-16.31-45.46c-.32-.93-.59-1.74-.8-2.45-.22-.71-.44-1.51-.67-2.41h-.39c-.23.9-.46,1.7-.69,2.41-.23.71-.51,1.52-.82,2.45l-16.53,45.46h-9.89s23.56-63.51,23.56-63.51h9.67s23.6,63.51,23.6,63.51h-10.72Z" />
        <path d="M53.98,170.21l31.22-36.86c.64-.74,1.22-1.38,1.72-1.92.51-.54,1.09-1.14,1.75-1.79l-.2-.34c-.89.25-1.7.45-2.43.6-.73.15-1.57.32-2.53.51l-47.64,8.42-4.95-8.57,66.78-11.36,4.84,8.38-43.2,52.19-5.36-9.28Z" />
        <path d="M21.89,82.78l47.53,8.61c.96.19,1.8.36,2.52.53.72.17,1.53.37,2.42.62l.2-.34c-.66-.65-1.24-1.25-1.74-1.8-.5-.55-1.07-1.2-1.71-1.94l-31.11-37.05,4.95-8.57,43.22,52.16-4.84,8.38-66.8-11.32,5.36-9.28Z" />
        <path d="M81.56,11.27l16.31,45.46c.32.93.59,1.74.8,2.45.22.71.44,1.51.67,2.41h.39c.23-.9.46-1.7.69-2.41.23-.71.51-1.52.82-2.45l16.53-45.46h9.89s-23.56,63.51-23.56,63.51h-9.67s-23.6-63.51-23.6-63.51h10.72Z" />
        <path d="M173.32,27.2l-31.22,36.86c-.64.74-1.22,1.38-1.72,1.92-.51.54-1.09,1.14-1.75,1.79l.2.34c.89-.25,1.7-.45,2.43-.6.73-.15,1.57-.32,2.53-.51l47.64-8.42,4.95,8.57-66.78,11.36-4.84-8.38,43.2-52.19,5.36,9.28Z" />
        <path d="M205.41,114.63l-47.53-8.61c-.96-.19-1.8-.36-2.52-.53-.72-.17-1.53-.37-2.42-.62l-.2.34c.66.65,1.24,1.25,1.74,1.8.5.55,1.07,1.2,1.71,1.94l31.11,37.05-4.95,8.57-43.22-52.16,4.84-8.38,66.8,11.32-5.36,9.28Z" />
      </g>
    </svg>
  )
}
