import styled from 'styled-components'
import { Ripples } from './Ripples'

export const Button = styled(Ripples).attrs({ type: 'button' })`
  &:focus {
    outline: 0;
  }
  width: 170px;
  height: 48px;
  margin: 2em auto;
  display: block;
  background-color: #2a2734;
  color: white;
  box-shadow: none;
  border: none;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  user-select: none;
  .ripple {
    background-color: rgb(78, 86, 105);
  }
`
