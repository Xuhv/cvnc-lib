/**
 * A fork of https://github.com/prabhuignoto/react-float-menu
 * 
 * esm.sh's version is broken, so I build this.
 * 
 * @module
 */

// deno-lint-ignore ban-ts-comment
// @ts-nocheck

import { jsx, jsxs } from "react/jsx-runtime";
import classNames from "classnames";
import React, { useEffect, useRef, useCallback, useContext, useMemo, memo, useState, createElement, type FunctionComponent, type ReactNode } from "react";
import { nanoid } from "nanoid";
function useMenuHidden(menuLeft, menuWidth, cb) {
  useEffect(() => {
    let dir;
    if (menuLeft < 0) {
      dir = "left";
    } else if (menuLeft + menuWidth > window.innerWidth) {
      dir = "right";
    } else {
      dir = null;
    }
    cb(dir);
  }, [menuLeft, menuWidth]);
}
const getStartingPosition = (pos, offset = 10) => {
  switch (pos) {
    case "top left":
      return `left: ${offset}px;top: ${offset}px;`;
    case "top right":
      return `right: ${offset}px;top: ${offset}px;`;
    case "bottom left":
      return `left: ${offset}px;bottom: ${offset}px;`;
    case "bottom right":
      return `right: ${offset}px;bottom: ${offset}px;`;
    default:
      return `left: ${offset}px;top: ${offset}px;`;
  }
};
const getLeft = (left, dimension) => {
  if (left < 0) {
    return 0;
  } else if (left + dimension > window.innerWidth) {
    return window.innerWidth - dimension;
  } else {
    return left;
  }
};
const getTop = (top, dimension) => {
  if (top < 0) {
    return 0;
  } else if (top + dimension > window.innerHeight) {
    return window.innerHeight - dimension;
  } else {
    return top;
  }
};
const usePosition = (settings) => {
  const {
    onPointerDown,
    onPointerUp,
    onDragStart,
    onDragEnd,
    startPosition,
    dimension = 0,
    startOffset,
    onInit,
    pin,
    onClosed
  } = settings;
  const ref = useRef(null);
  const isClicked = useRef(false);
  const isDragged = useRef(false);
  const keyPressed = useRef(false);
  const positionRef = useRef({
    left: 0,
    top: 0
  });
  const handlePointerDown = (ev) => {
    isClicked.current = true;
    const ele = ev.target;
    ev.stopPropagation();
    if (ev instanceof PointerEvent) {
      keyPressed.current = false;
      ele.setPointerCapture(ev.pointerId);
    } else if (ev instanceof KeyboardEvent) {
      keyPressed.current = true;
      if (ev.key === "Escape") {
        onClosed();
      }
      if (ev.key !== "Enter") {
        return;
      }
    }
    onPointerDown == null ? void 0 : onPointerDown();
  };
  const handlePointerUp = (ev) => {
    isClicked.current = false;
    const ele = ev.target;
    if (ev instanceof PointerEvent) {
      ele.releasePointerCapture(ev.pointerId);
    } else if (ev instanceof KeyboardEvent && ev.key !== "Enter") {
      return;
    }
    if (!isDragged.current) {
      onPointerUp == null ? void 0 : onPointerUp();
    } else {
      isDragged.current = false;
      onDragEnd == null ? void 0 : onDragEnd(positionRef.current);
    }
  };
  const onPointerMove = (e) => {
    if (isClicked.current && ref.current && !keyPressed.current) {
      const halfWidth = Math.round(dimension / 2);
      const x = e.clientX - halfWidth;
      const y = e.clientY - halfWidth;
      const position = {
        left: getLeft(x, dimension),
        top: getTop(y, dimension)
      };
      if (!isDragged.current) {
        isDragged.current = true;
        onDragStart == null ? void 0 : onDragStart(position);
      }
      positionRef.current = position;
      ref.current.style.cssText += `top: ${position.top}px;left: ${position.left}px;`;
    }
  };
  const setup = useCallback((node) => {
    if (node) {
      ref.current = node;
      node.addEventListener("pointerdown", handlePointerDown);
      node.addEventListener("keydown", handlePointerDown);
      node.addEventListener("pointerup", handlePointerUp);
      node.addEventListener("keyup", handlePointerUp);
      node.style.touchAction = "none";
      node.style.cssText += `position: absolute;z-index: 9999;${getStartingPosition(
        startPosition,
        startOffset
      )}`;
      const { left, top } = node.getBoundingClientRect();
      onInit({
        left,
        top
      });
    }
  }, []);
  useEffect(() => {
    if (!pin) {
      document.addEventListener("pointermove", onPointerMove);
      return () => {
        document.removeEventListener("pointermove", onPointerMove);
      };
    }
  }, []);
  return {
    ref,
    setup
  };
};
const defaultTheme = {
  menuBackgroundColor: "#FFFFFF",
  menuItemHoverColor: "#318CE7",
  menuItemHoverTextColor: "#fff",
  menuItemTextColor: "#000",
  primary: "#318CE7",
  secondary: "#FFFFFF"
};
const MenuContext = React.createContext({});
function useCloseOnClick(ref, menuOpen, onClose) {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target) && menuOpen) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handleClick);
    return () => {
      document.removeEventListener("pointerdown", handleClick);
    };
  }, [ref, onClose, menuOpen]);
}
function useCloseOnEscape(ref, onClose) {
  useEffect(() => {
    var _a;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose == null ? void 0 : onClose();
      }
    };
    (_a = ref.current) == null ? void 0 : _a.addEventListener("keyup", handleEscape);
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeEventListener("keyup", handleEscape);
    };
  }, [ref]);
}
function useKeyboardNav(ref, items, onNav) {
  const activeIndex = useRef(0);
  useEffect(() => {
    var _a;
    const handleNavigation = (ev) => {
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        let nextIndex = activeIndex.current + (ev.key === "ArrowDown" ? 1 : -1);
        if (nextIndex < 0) {
          nextIndex = items.length - 1;
        } else if (nextIndex > items.length - 1) {
          nextIndex = 0;
        }
        activeIndex.current = nextIndex;
        onNav(nextIndex);
      }
    };
    (_a = ref.current) == null ? void 0 : _a.addEventListener("keyup", handleNavigation);
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeEventListener("keyup", handleNavigation);
    };
  }, [ref, items]);
}
const ChevronRight = () => /* @__PURE__ */ jsx(
  "svg",
  {
    className: "feather feather-chevron-right",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" })
  }
);
const SvgComponent = () => /* @__PURE__ */ jsx(
  "svg",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12" })
  }
);
const list_item = "_list_item_11btq_1";
const rtl = "_rtl_11btq_10";
const no_icon = "_no_icon_11btq_13";
const icon = "_icon_11btq_18";
const list_item_name = "_list_item_name_11btq_27";
const list_item_icon = "_list_item_icon_11btq_54";
const child_menu_wrapper = "_child_menu_wrapper_11btq_67";
const menu_flip = "_menu_flip_11btq_74";
const chevron = "_chevron_11btq_81";
const chevron_right = "_chevron_right_11btq_95 _chevron_11btq_81";
const chevron_left = "_chevron_left_11btq_101 _chevron_11btq_81";
const styles$3 = {
  list_item,
  rtl,
  no_icon,
  icon,
  list_item_name,
  list_item_icon,
  child_menu_wrapper,
  menu_flip,
  chevron,
  chevron_right,
  chevron_left
};
const MenuItem = (props) => {
  const {
    name,
    icon: icon2,
    items = [],
    open: open2,
    onSelect,
    index,
    id,
    onMouseEnter,
    onMouseLeave,
    onToggleSubMenu,
    selected
  } = props;
  const { width = 250, RTL } = useContext(MenuContext);
  const itemClass = useMemo(
    () => classNames(
      styles$3.list_item,
      icon2 ? styles$3.icon : styles$3.no_icon,
      RTL ? styles$3.rtl : ""
    ),
    [icon2]
  );
  const canShowSubMenu = useMemo(() => items.length > 0 && selected, [
    items.length,
    selected
  ]);
  const handleMouseEnter = useCallback((ev) => {
    if (ev.pointerType === "mouse") {
      onMouseEnter == null ? void 0 : onMouseEnter(id);
    }
  }, []);
  const handleMouseLeave = useCallback((ev) => {
    if (ev.pointerType === "mouse") {
      onMouseLeave == null ? void 0 : onMouseLeave(id);
    }
  }, []);
  const handleClick = useCallback(
    (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      if (items.length <= 0) {
        onSelect == null ? void 0 : onSelect(name, index, id);
      } else {
        onToggleSubMenu == null ? void 0 : onToggleSubMenu(id);
      }
    },
    [onSelect]
  );
  const handleKeyUp = useCallback(
    (ev) => {
      if (ev.key !== "Enter") {
        return;
      }
      ev.stopPropagation();
      if (items.length > 0) {
        onToggleSubMenu == null ? void 0 : onToggleSubMenu(id);
      } else {
        onSelect == null ? void 0 : onSelect(name, index, id);
      }
    },
    [onSelect]
  );
  return /* @__PURE__ */ jsxs(
    "li",
    {
      className: itemClass,
      "data-cy": "rc-fltmenu-list-item",
      role: "listitem",
      tabIndex: 0,
      onKeyUp: handleKeyUp,
      onPointerDown: handleClick,
      onPointerEnter: handleMouseEnter,
      onPointerLeave: handleMouseLeave,
      children: [
        icon2 && /* @__PURE__ */ jsx("span", { className: styles$3.list_item_icon, role: "img", children: icon2 }),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-label": name,
            className: classNames(
              styles$3.list_item_name,
              RTL ? styles$3.rtl : "",
              !icon2 ? styles$3.no_icon : ""
            ),
            children: name
          }
        ),
        items.length > 0 ? /* @__PURE__ */ jsx(
          "span",
          {
            "aria-label": "expand menu",
            className: !RTL ? styles$3.chevron_right : styles$3.chevron_left,
            role: "img",
            children: /* @__PURE__ */ jsx(ChevronRight, {})
          }
        ) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            className: classNames(
              RTL ? styles$3.menu_flip : "",
              styles$3.child_menu_wrapper
            ),
            "data-cy": "rc-fltmenu-submenu",
            style: { width: `${width}px` },
            children: canShowSubMenu && /* @__PURE__ */ jsx(
              Menu,
              {
                disableAnimation: true,
                disableHeader: true,
                isSubMenu: true,
                items,
                open: open2,
                onSelect
              }
            )
          }
        )
      ]
    }
  );
};
MenuItem.displayName = "MenuItem";
const wrapper = "_wrapper_pyiq3_1";
const list = "_list_pyiq3_14";
const menu_open$1 = "_menu_open_pyiq3_52";
const no_animation = "_no_animation_pyiq3_55";
const menu_close = "_menu_close_pyiq3_60";
const hide = "_hide_pyiq3_66";
const close_btn = "_close_btn_pyiq3_70";
const flip$1 = "_flip_pyiq3_83";
const toolbar = "_toolbar_pyiq3_102";
const styles$2 = {
  wrapper,
  list,
  menu_open: menu_open$1,
  no_animation,
  "menu-open-animation": "_menu-open-animation_pyiq3_1",
  menu_close,
  "menu-close-animation": "_menu-close-animation_pyiq3_1",
  hide,
  close_btn,
  flip: flip$1,
  toolbar
};
const Menu = memo((props) => {
  const {
    items = [],
    menuHeadPosition,
    open: open2,
    onClose,
    closeImmediate,
    onRender,
    disableHeader = false,
    disableAnimation = false,
    isSubMenu = false,
    onSelect
  } = props;
  const [_items, setItems] = useState(
    () => items.map((item) => ({ ...item, id: nanoid(), selected: false }))
  );
  const listRef = useRef();
  const outerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const { theme, iconSize, RTL, closeOnClickOutside } = useContext(MenuContext);
  useCloseOnEscape(listRef, () => {
    handleClose();
  });
  if (closeOnClickOutside) {
    useCloseOnClick(outerRef, open2, () => {
      handleClose();
    });
  }
  useKeyboardNav(listRef, _items, (index) => {
    var _a;
    const elementToFocus = (_a = listRef.current) == null ? void 0 : _a.querySelectorAll(
      `li:nth-of-type(${index + 1})`
    )[0];
    elementToFocus == null ? void 0 : elementToFocus.focus();
  });
  const activeIndex = useRef(0);
  const style = useMemo(
    () => ({
      "--menu-height": `${height}px`,
      "--rc-fltmenu-icon-size": iconSize,
      "--rc-fltmenu-menu-bg-color": theme == null ? void 0 : theme.menuBackgroundColor,
      "--rc-fltmenu-menu-item-hover": theme == null ? void 0 : theme.menuItemHoverColor,
      "--rc-fltmenu-menu-item-hover-text": theme == null ? void 0 : theme.menuItemHoverTextColor,
      "--rc-fltmenu-menu-item-text": theme == null ? void 0 : theme.menuItemTextColor,
      "--rc-fltmenu-primary": theme == null ? void 0 : theme.primary,
      "--rc-fltmenu-secondary": theme == null ? void 0 : theme.secondary
    }),
    [height, JSON.stringify(menuHeadPosition)]
  );
  const canOpen = useMemo(() => open2 && !closeImmediate && !disableAnimation, [
    open2,
    closeImmediate
  ]);
  const canClose = useMemo(() => !closeImmediate && open2 !== null, [open2]);
  const openClass = useMemo(() => {
    if (canOpen) {
      return styles$2.menu_open;
    } else if (canClose) {
      return styles$2.menu_close;
    } else if (!isSubMenu) {
      return styles$2.hide;
    } else {
      return "";
    }
  }, [canOpen, canClose]);
  const wrapperClass = useMemo(
    () => classNames(
      styles$2.wrapper,
      RTL ? styles$2.flip : "",
      disableAnimation ? styles$2.no_animation : "",
      closeImmediate ? styles$2.no_animation : "",
      isSubMenu ? styles$2.is_sub_menu : "",
      openClass
    ),
    [canOpen, RTL, canClose]
  );
  const listClass = useMemo(
    () => classNames(styles$2.list, !open2 ? styles$2.close : ""),
    [open2]
  );
  const onWrapperInit = useCallback(
    (node) => {
      if (node) {
        listRef.current = node;
        setTimeout(() => {
          const wrapperHeight = node.clientHeight + 40;
          setHeight(wrapperHeight);
          onRender == null ? void 0 : onRender(wrapperHeight, node.clientWidth);
        }, 500);
      }
    },
    [_items.length, activeIndex]
  );
  const handleClose = useCallback(
    (ev) => {
      ev == null ? void 0 : ev.stopPropagation();
      onClose == null ? void 0 : onClose();
    },
    [onClose]
  );
  const handleCloseViaKeyboard = useCallback(
    (ev) => {
      if (ev.key === "Enter") {
        onClose == null ? void 0 : onClose();
      }
    },
    [onClose]
  );
  const handleSelection = (name, index, id) => {
    onSelect == null ? void 0 : onSelect(name, index);
    setItems(
      (prev) => prev.map((item) => ({
        ...item,
        selected: item.id === id
      }))
    );
  };
  const handleMouseEnter = (id) => {
    setItems(
      (prev) => prev.map((item) => ({
        ...item,
        selected: item.id === id
      }))
    );
  };
  const onToggleSubMenu = useCallback((id) => {
    setItems(
      (prev) => prev.map((item) => ({
        ...item,
        selected: item.id === id ? !item.selected : false
      }))
    );
  }, []);
  const onCloseSubMenu = useCallback((id) => {
    setItems(
      (prev) => prev.map((item) => ({
        ...item,
        selected: item.id === id ? false : item.selected
      }))
    );
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: wrapperClass, ref: outerRef, style, children: [
    !disableHeader && /* @__PURE__ */ jsx("div", { className: classNames(styles$2.toolbar, RTL ? styles$2.flip : ""), children: /* @__PURE__ */ jsx(
      "span",
      {
        "aria-label": "Close",
        className: classNames(styles$2.close_btn, RTL ? styles$2.flip : ""),
        "data-cy": "rc-fltmenu-close",
        role: "button",
        tabIndex: 0,
        onKeyUp: handleCloseViaKeyboard,
        onPointerDown: handleClose,
        children: /* @__PURE__ */ jsx(SvgComponent, {})
      }
    ) }),
    /* @__PURE__ */ jsx("ul", { className: listClass, ref: onWrapperInit, children: _items.map((item, index) => /* @__PURE__ */ createElement(
      MenuItem,
      {
        ...item,
        icon: item.icon,
        index,
        items: item.items,
        key: item.id,
        open: open2,
        onCloseSubMenu,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: onCloseSubMenu,
        onSelect: handleSelection,
        onToggleSubMenu
      }
    )) })
  ] });
});
Menu.displayName = "Menu";
const menu_container = "_menu_container_1v4aq_1";
const open = "_open_1v4aq_9";
const close = "_close_1v4aq_12";
const menu_arrow = "_menu_arrow_1v4aq_16";
const menu_open = "_menu_open_1v4aq_30";
const flip = "_flip_1v4aq_30";
const styles$1 = {
  menu_container,
  open,
  close,
  menu_arrow,
  menu_open,
  flip
};
const MenuContainer = memo(
  ({
    closeImmediate,
    disableHeader,
    headPosition,
    menuPosition,
    onClose,
    onMenuRender,
    onSelect,
    open: open2,
    shouldFlipVertical
  }) => {
    const { left, top, bottom } = menuPosition;
    const { items, width, theme } = useContext(MenuContext);
    const menuContainerStyle = useMemo(() => {
      return {
        "--rc-fltmenu-menu-bg-color": theme == null ? void 0 : theme.menuBackgroundColor,
        "--rc-fltmenu-width": `${width}px`,
        [shouldFlipVertical ? "bottom" : "top"]: `${shouldFlipVertical ? bottom : top}px`,
        left: `${left}px`
      };
    }, [
      shouldFlipVertical,
      width,
      left,
      top,
      bottom,
      theme == null ? void 0 : theme.menuBackgroundColor
    ]);
    const arrowClass = useMemo(
      () => classNames(
        styles$1.menu_arrow,
        open2 ? styles$1.menu_open : styles$1.menu_close,
        shouldFlipVertical ? styles$1.flip : ""
      ),
      [open2, shouldFlipVertical]
    );
    const menuContainerClass = useMemo(
      () => classNames(styles$1.menu_container, open2 ? styles$1.open : styles$1.close),
      [open2]
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: menuContainerClass,
        "data-cy": "rc-fltmenu-container",
        style: menuContainerStyle,
        children: [
          /* @__PURE__ */ jsx("span", { className: arrowClass }),
          /* @__PURE__ */ jsx(
            Menu,
            {
              closeImmediate,
              disableHeader,
              items,
              menuHeadPosition: headPosition,
              open: open2,
              onClose,
              onRender: onMenuRender,
              onSelect
            }
          )
        ]
      }
    );
  }
);
MenuContainer.displayName = "MenuContainer";
const menu_head = "_menu_head_tb4t7_1";
const is_dragged = "_is_dragged_tb4t7_12";
const circle = "_circle_tb4t7_15";
const square = "_square_tb4t7_18";
const pressed = "_pressed_tb4t7_43";
const released = "_released_tb4t7_48";
const icon_container = "_icon_container_tb4t7_53";
const styles = {
  menu_head,
  is_dragged,
  circle,
  square,
  pressed,
  "pressed-animation": "_pressed-animation_tb4t7_1",
  released,
  "released-animation": "_released-animation_tb4t7_1",
  icon_container
};
const MenuHead : FunctionComponent<MenuHeadProps> = ({
  dimension = 30,
  children,
  shape = "circle",
  items = [],
  startPosition = "top left",
  theme = defaultTheme,
  disableHeader = false,
  width = 250,
  onSelect,
  startOffset = 10,
  closeOnClickOutside = true,
  autoFlipMenu = true,
  bringMenuToFocus = true,
  iconSize = "1rem",
  pin,
  RTL = false
}) => {
  const [pressedState, setPressedState] = useState(false);
  const [openMenu, setMenuOpen] = useState(null);
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 });
  const [closeMenuImmediate, setCloseMenuImmediate] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const finalTheme = useMemo(() => ({ ...defaultTheme, ...theme }), []);
  const [menuDimension, setMenuDimension] = useState({ height: 0, width: 0 });
  const [menuPosition, setMenuPosition] = useState({ bottom: 0, left: 0, top: 0 });
  const [menuHiddenTowards, setMenuHiddenTowards] = useState();
  const headHalfWidth = useMemo(() => Math.round(dimension / 2), [dimension]);
  const isFirstRender = useRef(true);
  const { setup, ref } = usePosition({
    dimension,
    onClosed: () => {
      setMenuOpen(false);
      setPressedState(false);
    },
    onDragEnd: ({ left, top }) => {
      setHeadPosition({
        x: left || 0,
        y: (top || 0) + dimension + 10
      });
      setMenuOpen(false);
      setPressedState(false);
      setIsDragged(false);
    },
    onDragStart: ({ left, top }) => {
      setHeadPosition({
        x: left || 0,
        y: (top || 0) + dimension + 10
      });
      setCloseMenuImmediate(true);
      setMenuOpen(false);
      setIsDragged(true);
    },
    onInit: ({ left, top }) => {
      setHeadPosition({
        x: left || 0,
        y: (top || 0) + dimension + 10
      });
    },
    onPointerDown: () => {
      setPressedState(true);
      setCloseMenuImmediate(false);
    },
    onPointerUp: useCallback(() => {
      setPressedState(false);
      setMenuOpen((prev) => !prev);
    }, []),
    pin,
    startOffset,
    startPosition
  });
  useMenuHidden(menuPosition.left, menuDimension.width, (dir) => {
    setMenuHiddenTowards(dir);
  });
  const style = useMemo(
    () => ({
      "--dimension": `${dimension}px`,
      "--rc-fltmenu-primary": finalTheme.primary,
      "--rc-fltmenu-width": `${width}px`
    }),
    [finalTheme.primary]
  );
  const pressedClass = useMemo(() => {
    if (isFirstRender.current) {
      return "";
    }
    return pressedState ? styles.pressed : styles.released;
  }, [pressedState]);
  const menuHeadClass = useMemo(() => {
    return classNames(
      styles.menu_head,
      pressedClass,
      isDragged ? styles.is_dragged : "",
      {
        [styles[shape]]: true
      }
    );
  }, [pressedClass, isDragged]);
  const handleMenuClose = useCallback(() => {
    var _a;
    setMenuOpen(false);
    setCloseMenuImmediate(false);
    (_a = ref == null ? void 0 : ref.current) == null ? void 0 : _a.focus();
  }, []);
  const shouldFlipVertical = useMemo(() => {
    return autoFlipMenu && headPosition.y + dimension + menuDimension.height > window.innerHeight;
  }, [
    headPosition.x,
    headPosition.y,
    JSON.stringify(menuDimension),
    openMenu,
    autoFlipMenu
  ]);
  const onMenuRender = useCallback(
    (menuHeight, menuWidth) => setMenuDimension({ height: menuHeight, width: menuWidth }),
    []
  );
  useEffect(() => {
    setMenuPosition({
      left: Math.round(
        headPosition.x - (Math.round(menuDimension.width / 2) - headHalfWidth)
      ),
      [shouldFlipVertical ? "bottom" : "top"]: !shouldFlipVertical ? headPosition.y + 10 : Math.abs(window.innerHeight - headPosition.y) + dimension + 20
    });
  }, [
    shouldFlipVertical,
    headPosition.x,
    headPosition.y,
    menuDimension.width,
    headHalfWidth
  ]);
  const shouldAdjustMenuPosition = useMemo(
    () => !!(!isFirstRender.current && bringMenuToFocus && (ref == null ? void 0 : ref.current)),
    [openMenu, bringMenuToFocus]
  );
  useEffect(() => {
    if (!shouldAdjustMenuPosition) {
      return;
    }
    const alignedTo = startPosition.split(" ")[1];
    const { width: menuWidth } = menuDimension;
    const { innerWidth } = window;
    const headRef = ref.current;
    if (menuHiddenTowards === "left") {
      setMenuPosition({
        left: startOffset
      });
      headRef.style.cssText += `left: ${Math.round(menuWidth / 2) - headHalfWidth + startOffset}px;`;
    } else if (menuHiddenTowards === "right") {
      setMenuPosition({
        left: innerWidth - menuWidth - startOffset
      });
      headRef.style.cssText += `left: ${Math.round(innerWidth - menuWidth / 2) - headHalfWidth - 10}px;`;
    } else if (alignedTo === "left" && headPosition.x <= startOffset && pin) {
      headRef.style.cssText += `left: ${startOffset}px;`;
      setMenuPosition((prev) => ({
        ...prev,
        left: -menuWidth
      }));
    } else if (alignedTo === "right" && headPosition.x >= innerWidth - dimension - startOffset && pin) {
      headRef.style.cssText += `left: ${innerWidth - dimension - startOffset}px;`;
      setMenuPosition((prev) => ({
        ...prev,
        left: innerWidth
      }));
    }
  }, [openMenu, headPosition.x, shouldAdjustMenuPosition]);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);
  const handleSelection = useCallback((path) => {
    onSelect == null ? void 0 : onSelect(path);
    handleMenuClose();
  }, []);
  return /* @__PURE__ */ jsxs(
    MenuContext.Provider,
    {
      value: {
        RTL,
        closeOnClickOutside,
        dimension,
        disableHeader,
        iconSize,
        items,
        shape,
        theme: finalTheme,
        width
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: classNames(menuHeadClass),
            "data-cy": "rc-fltmenu-head",
            ref: setup,
            role: "button",
            style,
            tabIndex: 0,
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: classNames(styles.icon_container),
                "data-cy": "rc-fltmenu-icon",
                children
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          MenuContainer,
          {
            closeImmediate: closeMenuImmediate,
            disableHeader,
            headPosition,
            menuPosition,
            open: openMenu,
            shouldFlipVertical,
            onClose: handleMenuClose,
            onMenuRender,
            onSelect: handleSelection
          }
        )
      ]
    }
  );
};
export {
  MenuHead as Menu
};

export interface Theme {
    menuBackgroundColor?: string;
    menuItemHoverColor?: string;
    menuItemHoverTextColor?: string;
    primary?: string;
    secondary?: string;
    menuItemTextColor?: string;
}

export interface MenuItemProps {
    name: string;
    id?: string;
    onSelected?: (id: string, name: string) => void;
    items?: MenuItemProps[];
    selected?: boolean;
    icon?: ReactNode;
}

export type Position =
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";

export interface MenuHeadProps {
    autoFlipMenu?: boolean;
    bringMenuToFocus?: boolean;
    children?: ReactNode;
    closeOnClickOutside?: boolean;
    dimension?: number;
    disableHeader?: boolean;
    items?: MenuItemProps[];
    onSelect?: (path: string) => void;
    shape?: "circle" | "square";
    startOffset?: number;
    startPosition?: Position;
    theme?: Theme;
    width?: number;
    iconSize?: string;
    pin?: boolean;
    RTL?: boolean;
}

