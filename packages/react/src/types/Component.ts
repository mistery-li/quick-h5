export interface ComponentData {
  uuid?: number
  label: string,
  icon: string,
  name: string,
  component: string,
  propValue: string,
  styles: Styles
}

export interface Styles {
  width: number,
  height: number,
  fontSize: number,
  textAlign?: 'left' | 'center' | 'right',
  color: 'string',
  position: 'absolute',
  transform: string
}