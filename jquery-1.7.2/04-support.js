// **jQuery Annotated Source**.
//
// [Home](/jquery-annotated-source/) | [Previous Chapter](03-deferred.html) | [Next Chapter](05-data.html)

// ## Chapter 4: Support

(function(jQuery) {

   jQuery.support = (function() {

      var support,
            all,
            a,
            select,
            opt,
            input,
            fragment,
            tds,
            events,
            eventName,
            i,
            isSupported,
            div = document.createElement("div"),
            documentElement = document.documentElement;

      // Preliminary tests
      div.setAttribute("className", "t");
      div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

      all = div.getElementsByTagName("*");
      a = div.getElementsByTagName("a")[ 0 ];

      // Can't get basic test support
      if (!all || !all.length || !a) {
         return {};
      }

      // First batch of supports tests
      select = document.createElement("select");
      opt = select.appendChild(document.createElement("option"));
      input = div.getElementsByTagName("input")[ 0 ];

      support = {
         // IE strips leading whitespace when .innerHTML is used
         leadingWhitespace:     ( div.firstChild.nodeType === 3 ),

         // Make sure that tbody elements aren't automatically inserted
         // IE will insert them into empty tables
         tbody:                 !div.getElementsByTagName("tbody").length,

         // Make sure that link elements get serialized correctly by innerHTML
         // This requires a wrapper element in IE
         htmlSerialize:         !!div.getElementsByTagName("link").length,

         // Get the style information from getAttribute
         // (IE uses .cssText instead)
         style:                 /top/.test(a.getAttribute("style")),

         // Make sure that URLs aren't manipulated
         // (IE normalizes it by default)
         hrefNormalized:        ( a.getAttribute("href") === "/a" ),

         // Make sure that element opacity exists
         // (IE uses filter instead)
         // Use a regex to work around a WebKit issue. See #5145
         opacity:               /^0.55/.test(a.style.opacity),

         // Verify style float existence
         // (IE uses styleFloat instead of cssFloat)
         cssFloat:              !!a.style.cssFloat,

         // Make sure that if no value is specified for a checkbox
         // that it defaults to "on".
         // (WebKit defaults to "" instead)
         checkOn:               ( input.value === "on" ),

         // Make sure that a selected-by-default option has a working selected property.
         // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
         optSelected:           opt.selected,

         // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
         getSetAttribute:       div.className !== "t",

         // Tests for enctype support on a form(#6743)
         enctype:               !!document.createElement("form").enctype,

         // Makes sure cloning an html5 element does not cause problems
         // Where outerHTML is undefined, this still works
         html5Clone:            document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

         // Will be defined later
         submitBubbles:         true,
         changeBubbles:         true,
         focusinBubbles:        false,
         deleteExpando:         true,
         noCloneEvent:          true,
         inlineBlockNeedsLayout:false,
         shrinkWrapBlocks:      false,
         reliableMarginRight:   true,
         pixelMargin:           true
      };

      // jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
      jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

      // Make sure checked status is properly cloned
      input.checked = true;
      support.noCloneChecked = input.cloneNode(true).checked;

      // Make sure that the options inside disabled selects aren't marked as disabled
      // (WebKit marks them as disabled)
      select.disabled = true;
      support.optDisabled = !opt.disabled;

      // Test to see if it's possible to delete an expando from an element
      // Fails in Internet Explorer
      try {
         delete div.test;
      } catch (e) {
         support.deleteExpando = false;
      }

      if (!div.addEventListener && div.attachEvent && div.fireEvent) {
         div.attachEvent("onclick", function() {
            // Cloning a node shouldn't copy over any
            // bound event handlers (IE does this)
            support.noCloneEvent = false;
         });
         div.cloneNode(true).fireEvent("onclick");
      }

      // Check if a radio maintains its value
      // after being appended to the DOM
      input = document.createElement("input");
      input.value = "t";
      input.setAttribute("type", "radio");
      support.radioValue = input.value === "t";

      input.setAttribute("checked", "checked");

      // 11217 - WebKit loses check when the name is after the checked attribute
      input.setAttribute("name", "t");

      div.appendChild(input);
      fragment = document.createDocumentFragment();
      fragment.appendChild(div.lastChild);

      // WebKit doesn't clone checked state correctly in fragments
      support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

      // Check if a disconnected checkbox will retain its checked
      // value of true after appended to the DOM (IE6/7)
      support.appendChecked = input.checked;

      fragment.removeChild(input);
      fragment.appendChild(div);

      // Technique from Juriy Zaytsev
      // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
      // We only care about the case where non-standard event systems
      // are used, namely in IE. Short-circuiting here helps us to
      // avoid an eval call (in setAttribute) which can cause CSP
      // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
      if (div.attachEvent) {
         for (i in {
            submit: 1,
            change: 1,
            focusin:1
         }) {
            eventName = "on" + i;
            isSupported = ( eventName in div );
            if (!isSupported) {
               div.setAttribute(eventName, "return;");
               isSupported = ( typeof div[ eventName ] === "function" );
            }
            support[ i + "Bubbles" ] = isSupported;
         }
      }

      fragment.removeChild(div);

      // Null elements to avoid leaks in IE
      fragment = select = opt = div = input = null;

      // Run tests that need a body at doc ready
      jQuery(function() {
         var container, outer, inner, table, td, offsetSupport,
               marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
               paddingMarginBorderVisibility, paddingMarginBorder,
               body = document.getElementsByTagName("body")[0];

         if (!body) {
            // Return for frameset docs that don't have a body
            return;
         }

         conMarginTop = 1;
         paddingMarginBorder = "padding:0;margin:0;border:";
         positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
         paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
         style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
         html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
               "<table " + style + "' cellpadding='0' cellspacing='0'>" +
               "<tr><td></td></tr></table>";

         container = document.createElement("div");
         container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
         body.insertBefore(container, body.firstChild);

         // Construct the test element
         div = document.createElement("div");
         container.appendChild(div);

         // Check if table cells still have offsetWidth/Height when they are set
         // to display:none and there are still other visible table cells in a
         // table row; if so, offsetWidth/Height are not reliable for use when
         // determining if an element has been hidden directly using
         // display:none (it is still safe to use offsets if a parent element is
         // hidden; don safety goggles and see bug #4512 for more information).
         // (only IE 8 fails this test)
         div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
         tds = div.getElementsByTagName("td");
         isSupported = ( tds[ 0 ].offsetHeight === 0 );

         tds[ 0 ].style.display = "";
         tds[ 1 ].style.display = "none";

         // Check if empty table cells still have offsetWidth/Height
         // (IE <= 8 fail this test)
         support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

         // Check if div with explicit width and no margin-right incorrectly
         // gets computed margin-right based on width of container. For more
         // info see bug #3333
         // Fails in WebKit before Feb 2011 nightlies
         // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
         if (window.getComputedStyle) {
            div.innerHTML = "";
            marginDiv = document.createElement("div");
            marginDiv.style.width = "0";
            marginDiv.style.marginRight = "0";
            div.style.width = "2px";
            div.appendChild(marginDiv);
            support.reliableMarginRight =
                  ( parseInt(( window.getComputedStyle(marginDiv, null) || { marginRight:0 } ).marginRight, 10) || 0 ) === 0;
         }

         if (typeof div.style.zoom !== "undefined") {
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            // (IE < 8 does this)
            div.innerHTML = "";
            div.style.width = div.style.padding = "1px";
            div.style.border = 0;
            div.style.overflow = "hidden";
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

            // Check if elements with layout shrink-wrap their children
            // (IE 6 does this)
            div.style.display = "block";
            div.style.overflow = "visible";
            div.innerHTML = "<div style='width:5px;'></div>";
            support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
         }

         div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
         div.innerHTML = html;

         outer = div.firstChild;
         inner = outer.firstChild;
         td = outer.nextSibling.firstChild.firstChild;

         offsetSupport = {
            doesNotAddBorder:             ( inner.offsetTop !== 5 ),
            doesAddBorderForTableAndCells:( td.offsetTop === 5 )
         };

         inner.style.position = "fixed";
         inner.style.top = "20px";

         // safari subtracts parent border width here which is 5px
         offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
         inner.style.position = inner.style.top = "";

         outer.style.overflow = "hidden";
         outer.style.position = "relative";

         offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
         offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

         if (window.getComputedStyle) {
            div.style.marginTop = "1%";
            support.pixelMargin = ( window.getComputedStyle(div, null) || { marginTop:0 } ).marginTop !== "1%";
         }

         if (typeof container.style.zoom !== "undefined") {
            container.style.zoom = 1;
         }

         body.removeChild(container);
         marginDiv = div = container = null;

         jQuery.extend(support, offsetSupport);
      });

      return support;
   })();

})(jQuery);
