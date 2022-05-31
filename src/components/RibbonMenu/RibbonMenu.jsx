//@ts-check
import React from 'react';

import './RibbonMenu.scss'
/**
 * @param {object} param
 * @param {any} param.children
 */
const RibbonMenu = ({ children }) => (
  <div className="ribbon">
    <div className="content">
      {children}
    </div>
  </div>
)

export default RibbonMenu;
