import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


import SimpleNumberWidget from '../../../../components/Widgets/numbers/SimpleNumberWidget';


const ResponsiveGridLayout = WidthProvider(Responsive);


const ChartWidget = ({ title, data, bgColor, textColor }) => (
    <div className="h-full flex flex-col">
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
        <div className="flex-1 flex items-center justify-center">
            <div className={`w-full h-24 ${bgColor} rounded-lg flex items-center justify-center`}>
                📊 Chart Data: {data?.value || 'Loading...'}
            </div>
        </div>
    </div>
);



const TableWidget = ({ title, data, bgColor, textColor }) => (
    <div className="h-full flex flex-col">
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
        <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-1">Name</th>
                        <th className="text-left p-1">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.rows?.map((row, idx) => (
                        <tr key={idx} className="border-b">
                            <td className="p-1">{row.name}</td>
                            <td className="p-1">{row.value}</td>
                        </tr>
                    )) || (
                            <tr><td colSpan="2" className="p-2 text-center">No data</td></tr>
                        )}
                </tbody>
            </table>
        </div>
    </div>
);

const CalendarWidget = ({ title, data, bgColor, textColor }) => (
    <div className="h-full flex flex-col">
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm">{data?.date || new Date().toDateString()}</div>
                <div className="text-xs mt-1">{data?.events || 0} events today</div>
            </div>
        </div>
    </div>
);

// Component Registry - Maps component names to actual components
const WIDGET_COMPONENTS = {
    'ChartWidget': ChartWidget,
    'StatsWidget': SimpleNumberWidget,
    'TableWidget': TableWidget,
    'CalendarWidget': CalendarWidget,
};

// Available widgets for adding to dashboard
const AVAILABLE_WIDGETS = [
    {
        componentName: 'ChartWidget',
        displayName: 'Chart Widget',
        description: 'Display charts and graphs',
        defaultProps: {
            title: 'Sales Chart',
            data: { value: '$12,345' },
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800'
        }
    },
    {
        componentName: 'StatsWidget',
        displayName: 'Statistics Widget',
        description: 'Show key metrics and numbers',
        defaultProps: {
            title: 'Total Users',
            data: { count: 1234, label: 'Active Users' },
            bgColor: 'bg-green-100',
            textColor: 'text-green-800'
        }
    },
    {
        componentName: 'TableWidget',
        displayName: 'Data Table',
        description: 'Display tabular data',
        defaultProps: {
            title: 'Recent Orders',
            data: {
                rows: [
                    { name: 'Order #1', value: '$299' },
                    { name: 'Order #2', value: '$199' },
                    { name: 'Order #3', value: '$399' }
                ]
            },
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800'
        }
    },
    {
        componentName: 'CalendarWidget',
        displayName: 'Calendar Widget',
        description: 'Show calendar and events',
        defaultProps: {
            title: 'Today\'s Schedule',
            data: { date: new Date().toDateString(), events: 3 },
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-800'
        }
    }
];

const DynamicComponentGrid = () => {
    // This structure matches what you'd store in your database
    const [dashboardItems, setDashboardItems] = useState([
        {
            i: 'widget_1',
            x: 0,
            y: 0,
            w: 6,
            h: 4,
            minW: 3,
            minH: 3,
            componentName: 'ChartWidget',
            userId: 'user_123',
            dashboardId: 'dashboard_main',
            widgetId: 'chart_sales_overview',
            title: 'Sales Overview',
            data: { value: '$45,230' },
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            refreshInterval: 30000,
            permissions: ['read', 'edit'],
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:22:00Z'
        },
        {
            i: 'widget_2',
            x: 6,
            y: 0,
            w: 3,
            h: 3,
            minW: 2,
            minH: 2,

            componentName: 'StatsWidget',
            userId: 'user_123',
            dashboardId: 'dashboard_main',
            widgetId: 'stats_active_users',

            title: 'Active Users',
            data: { count: 2847, label: 'Online Now' },
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',

            refreshInterval: 5000,
            permissions: ['read'],
            createdAt: '2024-01-15T10:35:00Z',
            updatedAt: '2024-01-20T14:22:00Z'
        },
        {
            i: 'widget_3',
            x: 9,
            y: 0,
            w: 3,
            h: 3,
            minW: 2,
            minH: 2,

            componentName: 'CalendarWidget',
            userId: 'user_123',
            dashboardId: 'dashboard_main',
            widgetId: 'calendar_today',

            title: 'Today\'s Events',
            data: { date: new Date().toDateString(), events: 5 },
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-800',

            refreshInterval: 60000,
            permissions: ['read', 'edit'],
            createdAt: '2024-01-15T10:40:00Z',
            updatedAt: '2024-01-20T14:22:00Z'
        }
    ]);

    const [nextId, setNextId] = useState(4);

    // Simulate loading from database
    useEffect(() => {
        // This is where you'd load from your backend
        // loadDashboardFromDatabase('user_123', 'dashboard_main');
    }, []);


    //   Layout to show in the dashboard 
    const getLayoutsFromItems = (items) => {
        const layout = items.map(item => ({
            i: item.i,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            minW: item.minW,
            minH: item.minH,
            static: item.static || false
        }));
        return { lg: layout };
    };

    // When the user will update the layout in the page 
    const onLayoutChange = (newLayout) => {
        const updatedItems = dashboardItems.map(item => {
            const layoutUpdate = newLayout.find(layout => layout.i === item.i);
            if (layoutUpdate) {
                return {
                    ...item,
                    x: layoutUpdate.x,
                    y: layoutUpdate.y,
                    w: layoutUpdate.w,
                    h: layoutUpdate.h,
                    updatedAt: new Date().toISOString()
                };
            }
            return item;
        });

        setDashboardItems(updatedItems);
    };

    const addWidget = (widgetType) => {
        const widget = AVAILABLE_WIDGETS.find(w => w.componentName === widgetType);
        if (!widget) return;

        const newItem = {
            i: `widget_${nextId}`,
            x: (nextId % 4) * 3,
            y: Math.floor(nextId / 4) * 4,
            w: 3,
            h: 3,
            minW: 2,
            minH: 2,

            // Widget properties
            componentName: widget.componentName,
            userId: 'user_123',
            dashboardId: 'dashboard_main',
            widgetId: `${widget.componentName.toLowerCase()}_${nextId}`,

            // Widget configuration
            ...widget.defaultProps,

            // Metadata
            refreshInterval: 30000,
            permissions: ['read', 'edit'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setDashboardItems([...dashboardItems, newItem]);
        setNextId(nextId + 1);

        // Save to backend
        // saveNewWidgetToDatabase(newItem);
    };

    // Remove widget
    const removeWidget = (widgetId) => {
        setDashboardItems(dashboardItems.filter(item => item.i !== widgetId));
        // removeWidgetFromDatabase(widgetId);
    };

    // Render dynamic component based on componentName
    const renderWidget = (item) => {
        const Component = WIDGET_COMPONENTS[item.componentName];

        if (!Component) {
            return (
                <div className="h-full flex items-center justify-center bg-red-100 text-red-800 rounded">
                    <div className="text-center">
                        <div className="text-lg mb-2">⚠️</div>
                        <div className="text-sm">Unknown Component:</div>
                        <div className="text-xs font-mono">{item.componentName}</div>
                    </div>
                </div>
            );
        }

        return (
            <Component
                title={item.title}
                data={item.data}
                bgColor={item.bgColor}
                textColor={item.textColor}
                {...item.componentProps} // Additional props for the component
            />
        );
    };

    // Simulate backend API functions
    const saveDashboardToDatabase = async (items) => {
        console.log('Saving dashboard to backend:', items);
        // API call to save dashboard layout
        // await fetch('/api/dashboard/save', { method: 'POST', body: JSON.stringify(items) });
    };

    const loadDashboardFromDatabase = async (userId, dashboardId) => {
        console.log('Loading dashboard from backend:', { userId, dashboardId });
        // API call to load dashboard
        // const response = await fetch(`/api/dashboard/${userId}/${dashboardId}`);
        // const data = await response.json();
        // setDashboardItems(data.items);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Dynamic Widget Dashboard
                </h1>

                {/* Widget Library */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Add Widgets:</h3>
                    <div className="flex gap-2 flex-wrap">
                        {AVAILABLE_WIDGETS.map(widget => (
                            <button
                                key={widget.componentName}
                                onClick={() => addWidget(widget.componentName)}
                                className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                title={widget.description}
                            >
                                + {widget.displayName}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-xs bg-green-50 p-3 rounded border-l-4 border-green-400 mb-4">
                    <strong>Database Structure:</strong> Each widget stores componentName, layout coordinates, user permissions, and configuration data.
                </div>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layouts={getLayoutsFromItems(dashboardItems)}
                onLayoutChange={onLayoutChange}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                isDraggable={true}
                isResizable={true}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                useCSSTransforms={true}
            >
                {dashboardItems.map((item) => (
                    <div
                        key={item.i}
                        className={`bg-gradient-to-br ${item.bgColor} rounded-xl shadow-lg border border-gray-200 p-4 group hover:shadow-xl transition-all duration-200`}
                    >
                        {/* Widget Header */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                {renderWidget(item)}
                            </div>
                            <button
                                onClick={() => removeWidget(item.i)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 ml-2"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Widget Footer - Debug Info */}
                        <div className="text-xs opacity-50 mt-2 pt-2 border-t border-gray-300">
                            <div>Component: {item.componentName}</div>
                            <div>Position: ({item.x}, {item.y}) Size: {item.w}×{item.h}</div>
                        </div>
                    </div>
                ))}
            </ResponsiveGridLayout>

            <style jsx global>{`
        .react-grid-item.react-grid-placeholder {
          background: rgb(59, 130, 246, 0.3) !important;
          border-radius: 12px !important;
          border: 2px dashed rgb(59, 130, 246) !important;
        }
      `}</style>
        </div>
    );
};

export default DynamicComponentGrid;