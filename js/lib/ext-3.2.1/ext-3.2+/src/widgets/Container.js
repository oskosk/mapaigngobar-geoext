/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.Container
 * @extends Ext.BoxComponent
 * <p>Base class for any {@link Ext.BoxComponent} that may contain other Components. Containers handle the
 * basic behavior of containing items, namely adding, inserting and removing items.</p>
 *
 * <p>The most commonly used Container classes are {@link Ext.Panel}, {@link Ext.Window} and {@link Ext.TabPanel}.
 * If you do not need the capabilities offered by the aforementioned classes you can create a lightweight
 * Container to be encapsulated by an HTML element to your specifications by using the
 * <code><b>{@link Ext.Component#autoEl autoEl}</b></code> config option. This is a useful technique when creating
 * embedded {@link Ext.layout.ColumnLayout column} layouts inside {@link Ext.form.FormPanel FormPanels}
 * for example.</p>
 *
 * <p>The code below illustrates both how to explicitly create a Container, and how to implicitly
 * create one using the <b><code>'container'</code></b> xtype:<pre><code>
// explicitly create a Container
var embeddedColumns = new Ext.Container({
    autoEl: 'div',  // This is the default
    layout: 'column',
    defaults: {
        // implicitly create Container by specifying xtype
        xtype: 'container',
        autoEl: 'div', // This is the default.
        layout: 'form',
        columnWidth: 0.5,
        style: {
            padding: '10px'
        }
    },
//  The two items below will be Ext.Containers, each encapsulated by a &lt;DIV> element.
    items: [{
        items: {
            xtype: 'datefield',
            name: 'startDate',
            fieldLabel: 'Start date'
        }
    }, {
        items: {
            xtype: 'datefield',
            name: 'endDate',
            fieldLabel: 'End date'
        }
    }]
});</code></pre></p>
 *
 * <p><u><b>Layout</b></u></p>
 * <p>Container classes delegate the rendering of child Components to a layout
 * manager class which must be configured into the Container using the
 * <code><b>{@link #layout}</b></code> configuration property.</p>
 * <p>When either specifying child <code>{@link #items}</code> of a Container,
 * or dynamically {@link #add adding} Components to a Container, remember to
 * consider how you wish the Container to arrange those child elements, and
 * whether those child elements need to be sized using one of Ext's built-in
 * <b><code>{@link #layout}</code></b> schemes. By default, Containers use the
 * {@link Ext.layout.ContainerLayout ContainerLayout} scheme which only
 * renders child components, appending them one after the other inside the
 * Container, and <b>does not apply any sizing</b> at all.</p>
 * <p>A common mistake is when a developer neglects to specify a
 * <b><code>{@link #layout}</code></b> (e.g. widgets like GridPanels or
 * TreePanels are added to Containers for which no <code><b>{@link #layout}</b></code>
 * has been specified). If a Container is left to use the default
 * {@link Ext.layout.ContainerLayout ContainerLayout} scheme, none of its
 * child components will be resized, or changed in any way when the Container
 * is resized.</p>
 * <p>Certain layout managers allow dynamic addition of child components.
 * Those that do include {@link Ext.layout.CardLayout},
 * {@link Ext.layout.AnchorLayout}, {@link Ext.layout.FormLayout}, and
 * {@link Ext.layout.TableLayout}. For example:<pre><code>
//  Create the GridPanel.
var myNewGrid = new Ext.grid.GridPanel({
    store: myStore,
    columns: myColumnModel,
    title: 'Results', // the title becomes the title of the tab
});

myTabPanel.add(myNewGrid); // {@link Ext.TabPanel} implicitly uses {@link Ext.layout.CardLayout CardLayout}
myTabPanel.{@link Ext.TabPanel#setActiveTab setActiveTab}(myNewGrid);
 * </code></pre></p>
 * <p>The example above adds a newly created GridPanel to a TabPanel. Note that
 * a TabPanel uses {@link Ext.layout.CardLayout} as its layout manager which
 * means all its child items are sized to {@link Ext.layout.FitLayout fit}
 * exactly into its client area.
 * <p><b><u>Overnesting is a common problem</u></b>.
 * An example of overnesting occurs when a GridPanel is added to a TabPanel
 * by wrapping the GridPanel <i>inside</i> a wrapping Panel (that has no
 * <code><b>{@link #layout}</b></code> specified) and then add that wrapping Panel
 * to the TabPanel. The point to realize is that a GridPanel <b>is</b> a
 * Component which can be added directly to a Container. If the wrapping Panel
 * has no <code><b>{@link #layout}</b></code> configuration, then the overnested
 * GridPanel will not be sized as expected.<p>
 *
 * <p><u><b>Adding via remote configuration</b></u></p>
 *
 * <p>A server side script can be used to add Components which are generated dynamically on the server.
 * An example of adding a GridPanel to a TabPanel where the GridPanel is generated by the server
 * based on certain parameters:
 * </p><pre><code>
// execute an Ajax request to invoke server side script:
Ext.Ajax.request({
    url: 'gen-invoice-grid.php',
    // send additional parameters to instruct server script
    params: {
        startDate: Ext.getCmp('start-date').getValue(),
        endDate: Ext.getCmp('end-date').getValue()
    },
    // process the response object to add it to the TabPanel:
    success: function(xhr) {
        var newComponent = eval(xhr.responseText); // see discussion below
        myTabPanel.add(newComponent); // add the component to the TabPanel
        myTabPanel.setActiveTab(newComponent);
    },
    failure: function() {
        Ext.Msg.alert("Grid create failed", "Server communication failure");
    }
});
</code></pre>
 * <p>The server script needs to return an executable Javascript statement which, when processed
 * using <code>eval()</code>, will return either a config object with an {@link Ext.Component#xtype xtype},
 * or an instantiated Component. The server might return this for example:</p><pre><code>
(function() {
    function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    };

    var store = new Ext.data.Store({
        url: 'get-invoice-data.php',
        baseParams: {
            startDate: '01/01/2008',
            endDate: '01/31/2008'
        },
        reader: new Ext.data.JsonReader({
            record: 'transaction',
            idProperty: 'id',
            totalRecords: 'total'
        }, [
           'customer',
           'invNo',
           {name: 'date', type: 'date', dateFormat: 'm/d/Y'},
           {name: 'value', type: 'float'}
        ])
    });

    var grid = new Ext.grid.GridPanel({
        title: 'Invoice Report',
        bbar: new Ext.PagingToolbar(store),
        store: store,
        columns: [
            {header: "Customer", width: 250, dataIndex: 'customer', sortable: true},
            {header: "Invoice Number", width: 120, dataIndex: 'invNo', sortable: true},
            {header: "Invoice Date", width: 100, dataIndex: 'date', renderer: formatDate, sortable: true},
            {header: "Value", width: 120, dataIndex: 'value', renderer: 'usMoney', sortable: true}
        ],
    });
    store.load();
    return grid;  // return instantiated component
})();
</code></pre>
 * <p>When the above code fragment is passed through the <code>eval</code> function in the success handler
 * of the Ajax request, the code is executed by the Javascript processor, and the anonymous function
 * runs, and returns the instantiated grid component.</p>
 * <p>Note: since the code above is <i>generated</i> by a server script, the <code>baseParams</code> for
 * the Store, the metadata to allow generation of the Record layout, and the ColumnModel
 * can all be generated into the code since these are all known on the server.</p>
 *
 * @xtype container
 */
Ext.Container = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {Boolean} monitorResize
     * True to automatically monitor window resize events to handle anything that is sensitive to the current size
     * of the viewport.  This value is typically managed by the chosen <code>{@link #layout}</code> and should not need
     * to be set manually.
     */
    /**
     * @cfg {String/Object} layout
     * <p><b>*Important</b>: In order for child items to be correctly sized and
     * positioned, typically a layout manager <b>must</b> be specified through
     * the <code>layout</code> configuration option.</p>
     * <br><p>The sizing and positioning of child {@link items} is the responsibility of
     * the Container's layout manager which creates and manages the type of layout
     * you have in mind.  For example:</p><pre><code>
new Ext.Window({
    width:300, height: 300,
    layout: 'fit', // explicitly set layout manager: override the default (layout:'auto')
    items: [{
        title: 'Panel inside a Window'
    }]
}).show();
     * </code></pre>
     * <p>If the {@link #layout} configuration is not explicitly specified for
     * a general purpose container (e.g. Container or Panel) the
     * {@link Ext.layout.ContainerLayout default layout manager} will be used
     * which does nothing but render child components sequentially into the
     * Container (no sizing or positioning will be performed in this situation).
     * Some container classes implicitly specify a default layout
     * (e.g. FormPanel specifies <code>layout:'form'</code>). Other specific
     * purpose classes internally specify/manage their internal layout (e.g.
     * GridPanel, TabPanel, TreePanel, Toolbar, Menu, etc.).</p>
     * <br><p><b><code>layout</code></b> may be specified as either as an Object or
     * as a String:</p><div><ul class="mdetail-params">
     *
     * <li><u>Specify as an Object</u></li>
     * <div><ul class="mdetail-params">
     * <li>Example usage:</li>
<pre><code>
layout: {
    type: 'vbox',
    padding: '5',
    align: 'left'
}
</code></pre>
     *
     * <li><code><b>type</b></code></li>
     * <br/><p>The layout type to be used for this container.  If not specified,
     * a default {@link Ext.layout.ContainerLayout} will be created and used.</p>
     * <br/><p>Valid layout <code>type</code> values are:</p>
     * <div class="sub-desc"><ul class="mdetail-params">
     * <li><code><b>{@link Ext.layout.AbsoluteLayout absolute}</b></code></li>
     * <li><code><b>{@link Ext.layout.AccordionLayout accordion}</b></code></li>
     * <li><code><b>{@link Ext.layout.AnchorLayout anchor}</b></code></li>
     * <li><code><b>{@link Ext.layout.ContainerLayout auto}</b></code> &nbsp;&nbsp;&nbsp; <b>Default</b></li>
     * <li><code><b>{@link Ext.layout.BorderLayout border}</b></code></li>
     * <li><code><b>{@link Ext.layout.CardLayout card}</b></code></li>
     * <li><code><b>{@link Ext.layout.ColumnLayout column}</b></code></li>
     * <li><code><b>{@link Ext.layout.FitLayout fit}</b></code></li>
     * <li><code><b>{@link Ext.layout.FormLayout form}</b></code></li>
     * <li><code><b>{@link Ext.layout.HBoxLayout hbox}</b></code></li>
     * <li><code><b>{@link Ext.layout.MenuLayout menu}</b></code></li>
     * <li><code><b>{@link Ext.layout.TableLayout table}</b></code></li>
     * <li><code><b>{@link Ext.layout.ToolbarLayout toolbar}</b></code></li>
     * <li><code><b>{@link Ext.layout.VBoxLayout vbox}</b></code></li>
     * </ul></div>
     *
     * <li>Layout specific configuration properties</li>
     * <br/><p>Additional layout specific configuration properties may also be
     * specified. For complete details regarding the valid config options for
     * each layout type, see the layout class corresponding to the <code>type</code>
     * specified.</p>
     *
     * </ul></div>
     *
     * <li><u>Specify as a String</u></li>
     * <div><ul class="mdetail-params">
     * <li>Example usage:</li>
<pre><code>
layout: 'vbox',
layoutConfig: {
    padding: '5',
    align: 'left'
}
</code></pre>
     * <li><code><b>layout</b></code></li>
     * <br/><p>The layout <code>type</code> to be used for this container (see list
     * of valid layout type values above).</p><br/>
     * <li><code><b>{@link #layoutConfig}</b></code></li>
     * <br/><p>Additional layout specific configuration properties. For complete
     * details regarding the valid config options for each layout type, see the
     * layout class corresponding to the <code>layout</code> specified.</p>
     * </ul></div></ul></div>
     */
    /**
     * @cfg {Object} layoutConfig
     * This is a config object containing properties specific to the chosen
     * <b><code>{@link #layout}</code></b> if <b><code>{@link #layout}</code></b>
     * has been specified as a <i>string</i>.</p>
     */
    /**
     * @cfg {Boolean/Number} bufferResize
     * When set to true (50 milliseconds) or a number of milliseconds, the layout assigned for this container will buffer
     * the frequency it calculates and does a re-layout of components. This is useful for heavy containers or containers
     * with a large quantity of sub-components for which frequent layout calls would be expensive. Defaults to <code>50</code>.
     */
    bufferResize: 50,

    /**
     * @cfg {String/Number} activeItem
     * A string component id or the numeric index of the component that should be initially activated within the
     * container's layout on render.  For example, activeItem: 'item-1' or activeItem: 0 (index 0 = the first
     * item in the container's collection).  activeItem only applies to layout styles that can display
     * items one at a time (like {@link Ext.layout.AccordionLayout}, {@link Ext.layout.CardLayout} and
     * {@link Ext.layout.FitLayout}).  Related to {@link Ext.layout.ContainerLayout#activeItem}.
     */
    /**
     * @cfg {Object/Array} items
     * <pre><b>** IMPORTANT</b>: be sure to <b>{@link #layout specify a <code>layout</code>} if needed ! **</b></pre>
     * <p>A single item, or an array of child Components to be added to this container,
     * for example:</p>
     * <pre><code>
// specifying a single item
items: {...},
layout: 'fit',    // specify a layout!

// specifying multiple items
items: [{...}, {...}],
layout: 'anchor', // specify a layout!
     * </code></pre>
     * <p>Each item may be:</p>
     * <div><ul class="mdetail-params">
     * <li>any type of object based on {@link Ext.Component}</li>
     * <li>a fully instanciated object or</li>
     * <li>an object literal that:</li>
     * <div><ul class="mdetail-params">
     * <li>has a specified <code>{@link Ext.Component#xtype xtype}</code></li>
     * <li>the {@link Ext.Component#xtype} specified is associated with the Component
     * desired and should be chosen from one of the available xtypes as listed
     * in {@link Ext.Component}.</li>
     * <li>If an <code>{@link Ext.Component#xtype xtype}</code> is not explicitly
     * specified, the {@link #defaultType} for that Container is used.</li>
     * <li>will be "lazily instanciated", avoiding the overhead of constructing a fully
     * instanciated Component object</li>
     * </ul></div></ul></div>
     * <p><b>Notes</b>:</p>
     * <div><ul class="mdetail-params">
     * <li>Ext uses lazy rendering. Child Components will only be rendered
     * should it become necessary. Items are automatically laid out when they are first
     * shown (no sizing is done while hidden), or in response to a {@link #doLayout} call.</li>
     * <li>Do not specify <code>{@link Ext.Panel#contentEl contentEl}</code>/
     * <code>{@link Ext.Panel#html html}</code> with <code>items</code>.</li>
     * </ul></div>
     */
    /**
     * @cfg {Object|Function} defaults
     * <p>This option is a means of applying default settings to all added items whether added through the {@link #items}
     * config or via the {@link #add} or {@link #insert} methods.</p>
     * <p>If an added item is a config object, and <b>not</b> an instantiated Component, then the default properties are
     * unconditionally applied. If the added item <b>is</b> an instantiated Component, then the default properties are
     * applied conditionally so as not to override existing properties in the item.</p>
     * <p>If the defaults option is specified as a function, then the function will be called using this Container as the
     * scope (<code>this</code> reference) and passing the added item as the first parameter. Any resulting object
     * from that call is then applied to the item as default properties.</p>
     * <p>For example, to automatically apply padding to the body of each of a set of
     * contained {@link Ext.Panel} items, you could pass: <code>defaults: {bodyStyle:'padding:15px'}</code>.</p>
     * <p>Usage:</p><pre><code>
defaults: {               // defaults are applied to items, not the container
    autoScroll:true
},
items: [
    {
        xtype: 'panel',   // defaults <b>do not</b> have precedence over
        id: 'panel1',     // options in config objects, so the defaults
        autoScroll: false // will not be applied here, panel1 will be autoScroll:false
    },
    new Ext.Panel({       // defaults <b>do</b> have precedence over options
        id: 'panel2',     // options in components, so the defaults
        autoScroll: false // will be applied here, panel2 will be autoScroll:true.
    })
]
     * </code></pre>
     */


    /** @cfg {Boolean} autoDestroy
     * If true the container will automatically destroy any contained component that is removed from it, else
     * destruction must be handled manually (defaults to true).
     */
    autoDestroy : true,

    /** @cfg {Boolean} forceLayout
     * If true the container will force a layout initially even if hidden or collapsed. This option
     * is useful for forcing forms to render in collapsed or hidden containers. (defaults to false).
     */
    forceLayout: false,

    /** @cfg {Boolean} hideBorders
     * True to hide the borders of each contained component, false to defer to the component's existing
     * border settings (defaults to false).
     */
    /** @cfg {String} defaultType
     * <p>The default {@link Ext.Component xtype} of child Components to create in this Container when
     * a child item is specified as a raw configuration object, rather than as an instantiated Component.</p>
     * <p>Defaults to <code>'panel'</code>, except {@link Ext.menu.Menu} which defaults to <code>'menuitem'</code>,
     * and {@link Ext.Toolbar} and {@link Ext.ButtonGroup} which default to <code>'button'</code>.</p>
     */
    defaultType : 'panel',

    /** @cfg {String} resizeEvent
     * The event to listen to for resizing in layouts. Defaults to <code>'resize'</code>.
     */
    resizeEvent: 'resize',

    /**
     * @cfg {Array} bubbleEvents
     * <p>An array of events that, when fired, should be bubbled to any parent container.
     * See {@link Ext.util.Observable#enableBubble}.
     * Defaults to <code>['add', 'remove']</code>.
     */
    bubbleEvents: ['add', 'remove'],

    // private
    initComponent : function(){
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event afterlayout
             * Fires when the components in this container are arranged by the associated layout manager.
             * @param {Ext.Container} this
             * @param {ContainerLayout} layout The ContainerLayout implementation for this container
             */
            'afterlayout',
            /**
             * @event beforeadd
             * Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being added
             * @param {Number} index The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was added
             * @param {Number} index The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was removed
             */
            'remove'
        );

        /**
         * The collection of components in this container as a {@link Ext.util.MixedCollection}
         * @type MixedCollection
         * @property items
         */
        var items = this.items;
        if(items){
            delete this.items;
            this.add(items);
        }
    },

    // private
    initItems : function(){
        if(!this.items){
            this.items = new Ext.util.MixedCollection(false, this.getComponentId);
            this.getLayout(); // initialize the layout
        }
    },

    // private
    setLayout : function(layout){
        if(this.layout && this.layout != layout){
            this.layout.setContainer(null);
        }
        this.layout = layout;
        this.initItems();
        layout.setContainer(this);
    },

    afterRender: function(){
        // Render this Container, this should be done before setLayout is called which
        // will hook onResize
        Ext.Container.superclass.afterRender.call(this);
        if(!this.layout){
            this.layout = 'auto';
        }
        if(Ext.isObject(this.layout) && !this.layout.layout){
            this.layoutConfig = this.layout;
            this.layout = this.layoutConfig.type;
        }
        if(Ext.isString(this.layout)){
            this.layout = new Ext.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
        }
        this.setLayout(this.layout);

        // If a CardLayout, the active item set
        if(this.activeItem !== undefined){
            var item = this.activeItem;
            delete this.activeItem;
            this.layout.setActiveItem(item);
        }

        // If we have no ownerCt, render and size all children
        if(!this.ownerCt){
            this.doLayout(false, true);
        }

        // This is a manually configured flag set by users in conjunction with renderTo.
        // Not to be confused with the flag by the same name used in Layouts.
        if(this.monitorResize === true){
            Ext.EventManager.onWindowResize(this.doLayout, this, [false]);
        }
    },

    /**
     * <p>Returns the Element to be used to contain the child Components of this Container.</p>
     * <p>An implementation is provided which returns the Container's {@link #getEl Element}, but
     * if there is a more complex structure to a Container, this may be overridden to return
     * the element into which the {@link #layout layout} renders child Components.</p>
     * @return {Ext.Element} The Element to render child Components into.
     */
    getLayoutTarget : function(){
        return this.el;
    },

    // private - used as the key lookup function for the items collection
    getComponentId : function(comp){
        return comp.getItemId();
    },

    /**
     * <p>Adds {@link Ext.Component Component}(s) to this Container.</p>
     * <br><p><b>Description</b></u> :
     * <div><ul class="mdetail-params">
     * <li>Fires the {@link #beforeadd} event before adding</li>
     * <li>The Container's {@link #defaults default config values} will be applied
     * accordingly (see <code>{@link #defaults}</code> for details).</li>
     * <li>Fires the {@link #add} event after the component has been added.</li>
     * </ul></div>
     * <br><p><b>Notes</b></u> :
     * <div><ul class="mdetail-params">
     * <li>If the Container is <i>already rendered</i> when <code>add</code>
     * is called, you may need to call {@link #doLayout} to refresh the view which causes
     * any unrendered child Components to be rendered. This is required so that you can
     * <code>add</code> multiple child components if needed while only refreshing the layout
     * once. For example:<pre><code>
var tb = new {@link Ext.Toolbar}();
tb.render(document.body);  // toolbar is rendered
tb.add({text:'Button 1'}); // add multiple items ({@link #defaultType} for {@link Ext.Toolbar Toolbar} is 'button')
tb.add({text:'Button 2'});
tb.{@link #doLayout}();             // refresh the layout
     * </code></pre></li>
     * <li><i>Warning:</i> Containers directly managed by the BorderLayout layout manager
     * may not be removed or added.  See the Notes for {@link Ext.layout.BorderLayout BorderLayout}
     * for more details.</li>
     * </ul></div>
     * @param {...Object/Array} component
     * <p>Either one or more Components to add or an Array of Components to add.  See
     * <code>{@link #items}</code> for additional information.</p>
     * @return {Ext.Component/Array} The Components that were added.
     */
    add : function(comp){
        this.initItems();
        var args = arguments.length > 1;
        if(args || Ext.isArray(comp)){
            var result = [];
            Ext.each(args ? arguments : comp, function(c){
                result.push(this.add(c));
            }, this);
            return result;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        var index = this.items.length;
        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            this.items.add(c);
            // *onAdded
            c.onAdded(this, index);
            this.onAdd(c);
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

    onAdd : function(c){
        // Empty template method
    },

    // private
    onAdded : function(container, pos) {
        //overridden here so we can cascade down, not worth creating a template method.
        this.ownerCt = container;
        this.initRef();
        //initialize references for child items
        this.cascade(function(c){
            c.initRef();
        });
        this.fireEvent('added', this, container, pos);
    },

    /**
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add} event after the
     * Component has been inserted.
     * @param {Number} index The index at which the Component will be inserted
     * into the Container's items collection
     * @param {Ext.Component} component The child Component to insert.<br><br>
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.<br><br>
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this 'lazy instantiation', set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @return {Ext.Component} component The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp){
        this.initItems();
        var a = arguments, len = a.length;
        if(len > 2){
            var result = [];
            for(var i = len-1; i >= 1; --i) {
                result.push(this.insert(index, a[i]));
            }
            return result;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        index = Math.min(index, this.items.length);
        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            if(c.ownerCt == this){
                this.items.remove(c);
            }
            this.items.insert(index, c);
            c.onAdded(this, index);
            this.onAdd(c);
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

    // private
    applyDefaults : function(c){
        var d = this.defaults;
        if(d){
            if(Ext.isFunction(d)){
                d = d.call(this, c);
            }
            if(Ext.isString(c)){
                c = Ext.ComponentMgr.get(c);
                Ext.apply(c, d);
            }else if(!c.events){
                Ext.applyIf(c, d);
            }else{
                Ext.apply(c, d);
            }
        }
        return c;
    },

    // private
    onBeforeAdd : function(item){
        if(item.ownerCt){
            item.ownerCt.remove(item, false);
        }
        if(this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    /**
     * Removes a component from this container.  Fires the {@link #beforeremove} event before removing, then fires
     * the {@link #remove} event after the component has been removed.
     * @param {Component/String} component The component reference or id to remove.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component} component The Component that was removed.
     */
    remove : function(comp, autoDestroy){
        this.initItems();
        var c = this.getComponent(comp);
        if(c && this.fireEvent('beforeremove', this, c) !== false){
            this.doRemove(c, autoDestroy);
            this.fireEvent('remove', this, c);
        }
        return c;
    },

    onRemove: function(c){
        // Empty template method
    },

    // private
    doRemove: function(c, autoDestroy){
        var l = this.layout,
            hasLayout = l && this.rendered;

        if(hasLayout){
            l.onRemove(c);
        }
        this.items.remove(c);
        c.onRemoved();
        this.onRemove(c);
        if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
            c.destroy();
        }
        if(hasLayout){
            l.afterRemove(c);
        }
    },

    /**
     * Removes all components from this container.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Array} Array of the destroyed components
     */
    removeAll: function(autoDestroy){
        this.initItems();
        var item, rem = [], items = [];
        this.items.each(function(i){
            rem.push(i);
        });
        for (var i = 0, len = rem.length; i < len; ++i){
            item = rem[i];
            this.remove(item, autoDestroy);
            if(item.ownerCt !== this){
                items.push(item);
            }
        }
        return items;
    },

    /**
     * Examines this container's <code>{@link #items}</code> <b>property</b>
     * and gets a direct child component of this container.
     * @param {String/Number} comp This parameter may be any of the following:
     * <div><ul class="mdetail-params">
     * <li>a <b><code>String</code></b> : representing the <code>{@link Ext.Component#itemId itemId}</code>
     * or <code>{@link Ext.Component#id id}</code> of the child component </li>
     * <li>a <b><code>Number</code></b> : representing the position of the child component
     * within the <code>{@link #items}</code> <b>property</b></li>
     * </ul></div>
     * <p>For additional information see {@link Ext.util.MixedCollection#get}.
     * @return Ext.Component The component (if found).
     */
    getComponent : function(comp){
        if(Ext.isObject(comp)){
            comp = comp.getItemId();
        }
        return this.items.get(comp);
    },

    // private
    lookupComponent : function(comp){
        if(Ext.isString(comp)){
            return Ext.ComponentMgr.get(comp);
        }else if(!comp.events){
            return this.createComponent(comp);
        }
        return comp;
    },

    // private
    createComponent : function(config, defaultType){
        if (config.render) {
            return config;
        }
        // add in ownerCt at creation time but then immediately
        // remove so that onBeforeAdd can handle it
        var c = Ext.create(Ext.apply({
            ownerCt: this
        }, config), defaultType || this.defaultType);
        delete c.initialConfig.ownerCt;
        delete c.ownerCt;
        return c;
    },

    /**
     * @private
     * We can only lay out if there is a view area in which to layout.
     * display:none on the layout target, *or any of its parent elements* will mean it has no view area.
     */
    canLayout : function() {
        var el = this.getVisibilityEl();
        return el && el.dom && !el.isStyle("display", "none");
    },

    /**
     * Force this container's layout to be recalculated. A call to this function is required after adding a new component
     * to an already rendered container, or possibly after changing sizing/position properties of child components.
     * @param {Boolean} shallow (optional) True to only calc the layout of this component, and let child components auto
     * calc layouts as required (defaults to false, which calls doLayout recursively for each subcontainer)
     * @param {Boolean} force (optional) True to force a layout to occur, even if the item is hidden.
     * @return {Ext.Container} this
     */

    doLayout : function(shallow, force){
        var rendered = this.rendered,
            forceLayout = force || this.forceLayout;

        if(this.collapsed || !this.canLayout()){
            this.deferLayout = this.deferLayout || !shallow;
            if(!forceLayout){
                return;
            }
            shallow = shallow && !this.deferLayout;
        } else {
            delete this.deferLayout;
        }
        if(rendered && this.layout){
            this.layout.layout();
        }
        if(shallow !== true && this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++){
                var c = cs[i];
                if(c.doLayout){
                    c.doLayout(false, forceLayout);
                }
            }
        }
        if(rendered){
            this.onLayout(shallow, forceLayout);
        }
        // Initial layout completed
        this.hasLayout = true;
        delete this.forceLayout;
    },

    onLayout : Ext.emptyFn,

    // private
    shouldBufferLayout: function(){
        /*
         * Returns true if the container should buffer a layout.
         * This is true only if the container has previously been laid out
         * and has a parent container that is pending a layout.
         */
        var hl = this.hasLayout;
        if(this.ownerCt){
            // Only ever buffer if we've laid out the first time and we have one pending.
            return hl ? !this.hasLayoutPending() : false;
        }
        // Never buffer initial layout
        return hl;
    },

    // private
    hasLayoutPending: function(){
        // Traverse hierarchy to see if any parent container has a pending layout.
        var pending = false;
        this.ownerCt.bubble(function(c){
            if(c.layoutPending){
                pending = true;
                return false;
            }
        });
        return pending;
    },

    onShow : function(){
        // removes css classes that were added to hide
        Ext.Container.superclass.onShow.call(this);
        // If we were sized during the time we were hidden, layout.
        if(Ext.isDefined(this.deferLayout)){
            delete this.deferLayout;
            this.doLayout(true);
        }
    },

    /**
     * Returns the layout currently in use by the container.  If the container does not currently have a layout
     * set, a default {@link Ext.layout.ContainerLayout} will be created and set as the container's layout.
     * @return {ContainerLayout} layout The container's layout
     */
    getLayout : function(){
        if(!this.layout){
            var layout = new Ext.layout.AutoLayout(this.layoutConfig);
            this.setLayout(layout);
        }
        return this.layout;
    },

    // private
    beforeDestroy : function(){
        var c;
        if(this.items){
            while(c = this.items.first()){
                this.doRemove(c, true);
            }
        }
        if(this.monitorResize){
            Ext.EventManager.removeResizeListener(this.doLayout, this);
        }
        Ext.destroy(this.layout);
        Ext.Container.superclass.beforeDestroy.call(this);
    },

    /**
     * Bubbles up the component/container heirarchy, calling the specified function with each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Container} this
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
        return this;
    },

    /**
     * Cascades down the component/container heirarchy from this component (called first), calling the specified function with
     * each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current component)
     * @param {Array} args (optional) The args to call the function with (defaults to passing the current component)
     * @return {Ext.Container} this
     */
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || cs[i], args || [cs[i]]);
                    }
                }
            }
        }
        return this;
    },

    /**
     * Find a component under this container at any level by id
     * @param {String} id
     * @return Ext.Component
     */
    findById : function(id){
        var m, ct = this;
        this.cascade(function(c){
            if(ct != c && c.id === id){
                m = c;
                return false;
            }
        });
        return m || null;
    },

    /**
     * Find a component under this container at any level by xtype or class
     * @param {String/Class} xtype The xtype string for a component, or the class of the component directly
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Array} Array of Ext.Components
     */
    findByType : function(xtype, shallow){
        return this.findBy(function(c){
            return c.isXType(xtype, shallow);
        });
    },

    /**
     * Find a component under this container at any level by property
     * @param {String} prop
     * @param {String} value
     * @return {Array} Array of Ext.Components
     */
    find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },

    /**
     * Find a component under this container at any level by a custom function. If the passed function returns
     * true, the component will be included in the results. The passed function is called with the arguments (component, this container).
     * @param {Function} fn The function to call
     * @param {Object} scope (optional)
     * @return {Array} Array of Ext.Components
     */
    findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    },

    /**
     * Get a component contained by this container (alias for items.get(key))
     * @param {String/Number} key The index or id of the component
     * @return {Ext.Component} Ext.Component
     */
    get : function(key){
        return this.items.get(key);
    }
});

Ext.Container.LAYOUTS = {};
Ext.reg('container', Ext.Container);