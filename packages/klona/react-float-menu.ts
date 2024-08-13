/**
 * A fork of https://github.com/prabhuignoto/react-float-menu
 * 
 * esm.sh's version is broken, so I build this.
 * 
 * @module
 */

// deno-lint-ignore ban-ts-comment
// @ts-nocheck

import { jsx as h, jsxs as ee } from "react/jsx-runtime";
import P from "classnames";
import fe, { useEffect as S, useRef as R, useCallback as M, useContext as se, useMemo as g, memo as ue, useState as T, createElement as he, type FunctionComponent, type ReactNode } from "react";
import { nanoid as ye } from "nanoid";
function ge(t, n, c) {
  S(() => {
    let o;
    t < 0 ? o = "left" : t + n > window.innerWidth ? o = "right" : o = null, c(o);
  }, [t, n]);
}
const we = (t, n = 10) => {
  switch (t) {
    case "top left":
      return `left: ${n}px;top: ${n}px;`;
    case "top right":
      return `right: ${n}px;top: ${n}px;`;
    case "bottom left":
      return `left: ${n}px;bottom: ${n}px;`;
    case "bottom right":
      return `right: ${n}px;bottom: ${n}px;`;
    default:
      return `left: ${n}px;top: ${n}px;`;
  }
}, xe = (t, n) => t < 0 ? 0 : t + n > window.innerWidth ? window.innerWidth - n : t, be = (t, n) => t < 0 ? 0 : t + n > window.innerHeight ? window.innerHeight - n : t, ve = (t) => {
  const {
    onPointerDown: n,
    onPointerUp: c,
    onDragStart: o,
    onDragEnd: s,
    startPosition: u,
    dimension: _ = 0,
    startOffset: l,
    onInit: y,
    pin: d,
    onClosed: w
  } = t, x = R(null), v = R(!1), p = R(!1), m = R(!1), I = R({
    left: 0,
    top: 0
  }), N = (e) => {
    v.current = !0;
    const k = e.target;
    if (e.stopPropagation(), e instanceof PointerEvent)
      m.current = !1, k.setPointerCapture(e.pointerId);
    else if (e instanceof KeyboardEvent && (m.current = !0, e.key === "Escape" && w(), e.key !== "Enter"))
      return;
    n == null || n();
  }, r = (e) => {
    v.current = !1;
    const k = e.target;
    if (e instanceof PointerEvent)
      k.releasePointerCapture(e.pointerId);
    else if (e instanceof KeyboardEvent && e.key !== "Enter")
      return;
    p.current ? (p.current = !1, s == null || s(I.current)) : c == null || c();
  }, H = (e) => {
    if (v.current && x.current && !m.current) {
      const k = Math.round(_ / 2), A = e.clientX - k, D = e.clientY - k, L = {
        left: xe(A, _),
        top: be(D, _)
      };
      p.current || (p.current = !0, o == null || o(L)), I.current = L, x.current.style.cssText += `top: ${L.top}px;left: ${L.left}px;`;
    }
  }, C = M((e) => {
    if (e) {
      x.current = e, e.addEventListener("pointerdown", N), e.addEventListener("keydown", N), e.addEventListener("pointerup", r), e.addEventListener("keyup", r), e.style.touchAction = "none", e.style.cssText += `position: absolute;z-index: 9999;${we(
        u,
        l
      )}`;
      const { left: k, top: A } = e.getBoundingClientRect();
      y({
        left: k,
        top: A
      });
    }
  }, []);
  return S(() => {
    if (!d)
      return document.addEventListener("pointermove", H), () => {
        document.removeEventListener("pointermove", H);
      };
  }, []), {
    ref: x,
    setup: C
  };
}, ae = {
  menuBackgroundColor: "#FFFFFF",
  menuItemHoverColor: "#318CE7",
  menuItemHoverTextColor: "#fff",
  menuItemTextColor: "#000",
  primary: "#318CE7",
  secondary: "#FFFFFF"
}, te = fe.createContext({});
function Ce(t, n, c) {
  S(() => {
    const o = (s) => {
      t.current && !t.current.contains(s.target) && n && c();
    };
    return document.addEventListener("pointerdown", o), () => {
      document.removeEventListener("pointerdown", o);
    };
  }, [t, c, n]);
}
function ke(t, n) {
  S(() => {
    var o;
    const c = (s) => {
      s.key === "Escape" && (n == null || n());
    };
    return (o = t.current) == null || o.addEventListener("keyup", c), () => {
      var s;
      (s = t.current) == null || s.removeEventListener("keyup", c);
    };
  }, [t]);
}
function qe(t, n, c) {
  const o = R(0);
  S(() => {
    var u;
    const s = (_) => {
      if (_.key === "ArrowDown" || _.key === "ArrowUp") {
        let l = o.current + (_.key === "ArrowDown" ? 1 : -1);
        l < 0 ? l = n.length - 1 : l > n.length - 1 && (l = 0), o.current = l, c(l);
      }
    };
    return (u = t.current) == null || u.addEventListener("keyup", s), () => {
      var _;
      (_ = t.current) == null || _.removeEventListener("keyup", s);
    };
  }, [t, n]);
}
const Me = () => /* @__PURE__ */ h(
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
    children: /* @__PURE__ */ h("path", { d: "m9 18 6-6-6-6" })
  }
), Ee = () => /* @__PURE__ */ h(
  "svg",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ h("path", { d: "M18 6 6 18M6 6l12 12" })
  }
), $e = "_list_item_11btq_1", Pe = "_rtl_11btq_10", Ie = "_no_icon_11btq_13", Ne = "_icon_11btq_18", He = "_list_item_name_11btq_27", Le = "_list_item_icon_11btq_54", Te = "_child_menu_wrapper_11btq_67", Re = "_menu_flip_11btq_74", De = "_chevron_11btq_81", We = "_chevron_right_11btq_95 _chevron_11btq_81", Se = "_chevron_left_11btq_101 _chevron_11btq_81", $ = {
  list_item: $e,
  rtl: Pe,
  no_icon: Ie,
  icon: Ne,
  list_item_name: He,
  list_item_icon: Le,
  child_menu_wrapper: Te,
  menu_flip: Re,
  chevron: De,
  chevron_right: We,
  chevron_left: Se
}, _e = (t) => {
  const {
    name: n,
    icon: c,
    items: o = [],
    open: s,
    onSelect: u,
    index: _,
    id: l,
    onMouseEnter: y,
    onMouseLeave: d,
    onToggleSubMenu: w,
    selected: x
  } = t, { width: v = 250, RTL: p } = se(te), m = g(
    () => P(
      $.list_item,
      c ? $.icon : $.no_icon,
      p ? $.rtl : ""
    ),
    [c]
  ), I = g(() => o.length > 0 && x, [
    o.length,
    x
  ]), N = M((e) => {
    e.pointerType === "mouse" && (y == null || y(l));
  }, []), r = M((e) => {
    e.pointerType === "mouse" && (d == null || d(l));
  }, []), H = M(
    (e) => {
      e.stopPropagation(), e.preventDefault(), o.length <= 0 ? u == null || u(n, _, l) : w == null || w(l);
    },
    [u]
  ), C = M(
    (e) => {
      e.key === "Enter" && (e.stopPropagation(), o.length > 0 ? w == null || w(l) : u == null || u(n, _, l));
    },
    [u]
  );
  return /* @__PURE__ */ ee(
    "li",
    {
      className: m,
      "data-cy": "rc-fltmenu-list-item",
      role: "listitem",
      tabIndex: 0,
      onKeyUp: C,
      onPointerDown: H,
      onPointerEnter: N,
      onPointerLeave: r,
      children: [
        c && /* @__PURE__ */ h("span", { className: $.list_item_icon, role: "img", children: c }),
        /* @__PURE__ */ h(
          "span",
          {
            "aria-label": n,
            className: P(
              $.list_item_name,
              p ? $.rtl : "",
              c ? "" : $.no_icon
            ),
            children: n
          }
        ),
        o.length > 0 ? /* @__PURE__ */ h(
          "span",
          {
            "aria-label": "expand menu",
            className: p ? $.chevron_left : $.chevron_right,
            role: "img",
            children: /* @__PURE__ */ h(Me, {})
          }
        ) : null,
        /* @__PURE__ */ h(
          "div",
          {
            className: P(
              p ? $.menu_flip : "",
              $.child_menu_wrapper
            ),
            "data-cy": "rc-fltmenu-submenu",
            style: { width: `${v}px` },
            children: I && /* @__PURE__ */ h(
              ie,
              {
                disableAnimation: !0,
                disableHeader: !0,
                isSubMenu: !0,
                items: o,
                open: s,
                onSelect: u
              }
            )
          }
        )
      ]
    }
  );
};
_e.displayName = "MenuItem";
const Ae = "_wrapper_pyiq3_1", Be = "_list_pyiq3_14", Fe = "_menu_open_pyiq3_52", Ke = "_no_animation_pyiq3_55", je = "_menu_close_pyiq3_60", Ue = "_hide_pyiq3_66", ze = "_close_btn_pyiq3_70", Je = "_flip_pyiq3_83", Oe = "_toolbar_pyiq3_102", q = {
  wrapper: Ae,
  list: Be,
  menu_open: Fe,
  no_animation: Ke,
  "menu-open-animation": "_menu-open-animation_pyiq3_1",
  menu_close: je,
  "menu-close-animation": "_menu-close-animation_pyiq3_1",
  hide: Ue,
  close_btn: ze,
  flip: Je,
  toolbar: Oe
}, ie = ue((t) => {
  const {
    items: n = [],
    menuHeadPosition: c,
    open: o,
    onClose: s,
    closeImmediate: u,
    onRender: _,
    disableHeader: l = !1,
    disableAnimation: y = !1,
    isSubMenu: d = !1,
    onSelect: w
  } = t, [x, v] = T(
    () => n.map((i) => ({ ...i, id: ye(), selected: !1 }))
  ), p = R(), m = R(null), [I, N] = T(0), { theme: r, iconSize: H, RTL: C, closeOnClickOutside: e } = se(te);
  ke(p, () => {
    j();
  }), e && Ce(m, o, () => {
    j();
  }), qe(p, x, (i) => {
    var b;
    const a = (b = p.current) == null ? void 0 : b.querySelectorAll(
      `li:nth-of-type(${i + 1})`
    )[0];
    a == null || a.focus();
  });
  const k = R(0), A = g(
    () => ({
      "--menu-height": `${I}px`,
      "--rc-fltmenu-icon-size": H,
      "--rc-fltmenu-menu-bg-color": r == null ? void 0 : r.menuBackgroundColor,
      "--rc-fltmenu-menu-item-hover": r == null ? void 0 : r.menuItemHoverColor,
      "--rc-fltmenu-menu-item-hover-text": r == null ? void 0 : r.menuItemHoverTextColor,
      "--rc-fltmenu-menu-item-text": r == null ? void 0 : r.menuItemTextColor,
      "--rc-fltmenu-primary": r == null ? void 0 : r.primary,
      "--rc-fltmenu-secondary": r == null ? void 0 : r.secondary
    }),
    [I, JSON.stringify(c)]
  ), D = g(() => o && !u && !y, [
    o,
    u
  ]), L = g(() => !u && o !== null, [o]), X = g(() => D ? q.menu_open : L ? q.menu_close : d ? "" : q.hide, [D, L]), J = g(
    () => P(
      q.wrapper,
      C ? q.flip : "",
      y ? q.no_animation : "",
      u ? q.no_animation : "",
      d ? q.is_sub_menu : "",
      X
    ),
    [D, C, L]
  ), W = g(
    () => P(q.list, o ? "" : q.close),
    [o]
  ), ne = M(
    (i) => {
      i && (p.current = i, setTimeout(() => {
        const a = i.clientHeight + 40;
        N(a), _ == null || _(a, i.clientWidth);
      }, 500));
    },
    [x.length, k]
  ), j = M(
    (i) => {
      i == null || i.stopPropagation(), s == null || s();
    },
    [s]
  ), B = M(
    (i) => {
      i.key === "Enter" && (s == null || s());
    },
    [s]
  ), Y = (i, a, b) => {
    w == null || w(i, a), v(
      (G) => G.map((Q) => ({
        ...Q,
        selected: Q.id === b
      }))
    );
  }, oe = (i) => {
    v(
      (a) => a.map((b) => ({
        ...b,
        selected: b.id === i
      }))
    );
  }, U = M((i) => {
    v(
      (a) => a.map((b) => ({
        ...b,
        selected: b.id === i ? !b.selected : !1
      }))
    );
  }, []), F = M((i) => {
    v(
      (a) => a.map((b) => ({
        ...b,
        selected: b.id === i ? !1 : b.selected
      }))
    );
  }, []);
  return /* @__PURE__ */ ee("div", { className: J, ref: m, style: A, children: [
    !l && /* @__PURE__ */ h("div", { className: P(q.toolbar, C ? q.flip : ""), children: /* @__PURE__ */ h(
      "span",
      {
        "aria-label": "Close",
        className: P(q.close_btn, C ? q.flip : ""),
        "data-cy": "rc-fltmenu-close",
        role: "button",
        tabIndex: 0,
        onKeyUp: B,
        onPointerDown: j,
        children: /* @__PURE__ */ h(Ee, {})
      }
    ) }),
    /* @__PURE__ */ h("ul", { className: W, ref: ne, children: x.map((i, a) => /* @__PURE__ */ he(
      _e,
      {
        ...i,
        icon: i.icon,
        index: a,
        items: i.items,
        key: i.id,
        open: o,
        onCloseSubMenu: F,
        onMouseEnter: oe,
        onMouseLeave: F,
        onSelect: Y,
        onToggleSubMenu: U
      }
    )) })
  ] });
});
ie.displayName = "Menu";
const Xe = "_menu_container_1v4aq_1", Ye = "_open_1v4aq_9", Ge = "_close_1v4aq_12", Qe = "_menu_arrow_1v4aq_16", Ze = "_menu_open_1v4aq_30", Ve = "_flip_1v4aq_30", K = {
  menu_container: Xe,
  open: Ye,
  close: Ge,
  menu_arrow: Qe,
  menu_open: Ze,
  flip: Ve
}, de = ue(
  ({
    closeImmediate: t,
    disableHeader: n,
    headPosition: c,
    menuPosition: o,
    onClose: s,
    onMenuRender: u,
    onSelect: _,
    open: l,
    shouldFlipVertical: y
  }) => {
    const { left: d, top: w, bottom: x } = o, { items: v, width: p, theme: m } = se(te), I = g(() => ({
      "--rc-fltmenu-menu-bg-color": m == null ? void 0 : m.menuBackgroundColor,
      "--rc-fltmenu-width": `${p}px`,
      [y ? "bottom" : "top"]: `${y ? x : w}px`,
      left: `${d}px`
    }), [
      y,
      p,
      d,
      w,
      x,
      m == null ? void 0 : m.menuBackgroundColor
    ]), N = g(
      () => P(
        K.menu_arrow,
        l ? K.menu_open : K.menu_close,
        y ? K.flip : ""
      ),
      [l, y]
    ), r = g(
      () => P(K.menu_container, l ? K.open : K.close),
      [l]
    );
    return /* @__PURE__ */ ee(
      "div",
      {
        className: r,
        "data-cy": "rc-fltmenu-container",
        style: I,
        children: [
          /* @__PURE__ */ h("span", { className: N }),
          /* @__PURE__ */ h(
            ie,
            {
              closeImmediate: t,
              disableHeader: n,
              items: v,
              menuHeadPosition: c,
              open: l,
              onClose: s,
              onRender: u,
              onSelect: _
            }
          )
        ]
      }
    );
  }
);
de.displayName = "MenuContainer";
const et = "_menu_head_tb4t7_1", tt = "_is_dragged_tb4t7_12", nt = "_circle_tb4t7_15", ot = "_square_tb4t7_18", rt = "_pressed_tb4t7_43", st = "_released_tb4t7_48", it = "_icon_container_tb4t7_53", z = {
  menu_head: et,
  is_dragged: tt,
  circle: nt,
  square: ot,
  pressed: rt,
  "pressed-animation": "_pressed-animation_tb4t7_1",
  released: st,
  "released-animation": "_released-animation_tb4t7_1",
  icon_container: it
}, _t: FunctionComponent<MenuHeadProps> = ({
  dimension: t = 30,
  children: n,
  shape: c = "circle",
  items: o = [],
  startPosition: s = "top left",
  theme: u = ae,
  disableHeader: _ = !1,
  width: l = 250,
  onSelect: y,
  startOffset: d = 10,
  closeOnClickOutside: w = !0,
  autoFlipMenu: x = !0,
  bringMenuToFocus: v = !0,
  iconSize: p = "1rem",
  pin: m,
  RTL: I = !1
}) => {
  const [N, r] = T(!1), [H, C] = T(null), [e, k] = T({ x: 0, y: 0 }), [A, D] = T(!1), [L, X] = T(!1), J = g(() => ({ ...ae, ...u }), []), [W, ne] = T({ height: 0, width: 0 }), [j, B] = T({ bottom: 0, left: 0, top: 0 }), [Y, oe] = T(), U = g(() => Math.round(t / 2), [t]), F = R(!0), { setup: i, ref: a } = ve({
    dimension: t,
    onClosed: () => {
      C(!1), r(!1);
    },
    onDragEnd: ({ left: f, top: E }) => {
      k({
        x: f || 0,
        y: (E || 0) + t + 10
      }), C(!1), r(!1), X(!1);
    },
    onDragStart: ({ left: f, top: E }) => {
      k({
        x: f || 0,
        y: (E || 0) + t + 10
      }), D(!0), C(!1), X(!0);
    },
    onInit: ({ left: f, top: E }) => {
      k({
        x: f || 0,
        y: (E || 0) + t + 10
      });
    },
    onPointerDown: () => {
      r(!0), D(!1);
    },
    onPointerUp: M(() => {
      r(!1), C((f) => !f);
    }, []),
    pin: m,
    startOffset: d,
    startPosition: s
  });
  ge(j.left, W.width, (f) => {
    oe(f);
  });
  const b = g(
    () => ({
      "--dimension": `${t}px`,
      "--rc-fltmenu-primary": J.primary,
      "--rc-fltmenu-width": `${l}px`
    }),
    [J.primary]
  ), G = g(() => F.current ? "" : N ? z.pressed : z.released, [N]), Q = g(() => P(
    z.menu_head,
    G,
    L ? z.is_dragged : "",
    {
      [z[c]]: !0
    }
  ), [G, L]), ce = M(() => {
    var f;
    C(!1), D(!1), (f = a == null ? void 0 : a.current) == null || f.focus();
  }, []), Z = g(() => x && e.y + t + W.height > window.innerHeight, [
    e.x,
    e.y,
    JSON.stringify(W),
    H,
    x
  ]), pe = M(
    (f, E) => ne({ height: f, width: E }),
    []
  );
  S(() => {
    B({
      left: Math.round(
        e.x - (Math.round(W.width / 2) - U)
      ),
      [Z ? "bottom" : "top"]: Z ? Math.abs(window.innerHeight - e.y) + t + 20 : e.y + 10
    });
  }, [
    Z,
    e.x,
    e.y,
    W.width,
    U
  ]);
  const le = g(
    () => !!(!F.current && v && (a != null && a.current)),
    [H, v]
  );
  S(() => {
    if (!le)
      return;
    const f = s.split(" ")[1], { width: E } = W, { innerWidth: O } = window, V = a.current;
    Y === "left" ? (B({
      left: d
    }), V.style.cssText += `left: ${Math.round(E / 2) - U + d}px;`) : Y === "right" ? (B({
      left: O - E - d
    }), V.style.cssText += `left: ${Math.round(O - E / 2) - U - 10}px;`) : f === "left" && e.x <= d && m ? (V.style.cssText += `left: ${d}px;`, B((re) => ({
      ...re,
      left: -E
    }))) : f === "right" && e.x >= O - t - d && m && (V.style.cssText += `left: ${O - t - d}px;`, B((re) => ({
      ...re,
      left: O
    })));
  }, [H, e.x, le]), S(() => {
    F.current && (F.current = !1);
  }, []);
  const me = M((f) => {
    y == null || y(f), ce();
  }, []);
  return /* @__PURE__ */ ee(
    te.Provider,
    {
      value: {
        RTL: I,
        closeOnClickOutside: w,
        dimension: t,
        disableHeader: _,
        iconSize: p,
        items: o,
        shape: c,
        theme: J,
        width: l
      },
      children: [
        /* @__PURE__ */ h(
          "div",
          {
            className: P(Q),
            "data-cy": "rc-fltmenu-head",
            ref: i,
            role: "button",
            style: b,
            tabIndex: 0,
            children: /* @__PURE__ */ h(
              "span",
              {
                className: P(z.icon_container),
                "data-cy": "rc-fltmenu-icon",
                children: n
              }
            )
          }
        ),
        /* @__PURE__ */ h(
          de,
          {
            closeImmediate: A,
            disableHeader: _,
            headPosition: e,
            menuPosition: j,
            open: H,
            shouldFlipVertical: Z,
            onClose: ce,
            onMenuRender: pe,
            onSelect: me
          }
        )
      ]
    }
  );
};
export {
  _t as Menu
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

