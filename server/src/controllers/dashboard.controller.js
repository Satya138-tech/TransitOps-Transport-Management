const Trip = require('../models/trips.model');
const Vehicle = require('../models/vehicle.model');
const User = require('../models/user.model');

const getAdminDashboard = async (req, res) => {
    try {
        const totalVehicles = await Vehicle.countDocuments();
        const activeTripsCount = await Trip.countDocuments({ status: { $in: ['Assigned', 'In Transit'] } });
        const drivers = await User.find({ role: 'driver' });
        const activeDriversCount = drivers.filter(d => d.driverStatus === 'On Trip').length;
        const availableDriversCount = drivers.filter(d => d.driverStatus === 'Available').length;

        const totalSafety = drivers.reduce((acc, curr) => acc + (curr.safetyScore || 90), 0);
        const avgSafetyScore = drivers.length > 0 ? (totalSafety / drivers.length).toFixed(1) : '95.0';

        const kpiCards = [
            { label: 'Total Fleet Assets', value: `${totalVehicles} Vehicles`, change: 'All active and registered vehicles across 5 regions' },
            { label: 'Active Dispatches', value: `${activeTripsCount} Trips`, change: `${activeDriversCount} drivers currently on trip, ${availableDriversCount} on standby` },
            { label: 'Avg Driver Safety Score', value: `${avgSafetyScore}/100`, change: 'Evaluated dynamically based on backend ranking algorithm' }
        ];

        const availableVeh = await Vehicle.countDocuments({ status: 'Available' });
        const onTripVeh = await Vehicle.countDocuments({ status: 'On Trip' });
        const inShopVeh = await Vehicle.countDocuments({ status: 'In Shop' });
        const retiredVeh = await Vehicle.countDocuments({ status: 'Retired' });

        const fleetOverview = [
            { label: 'Available', value: availableVeh, tone: 'bg-emerald-400' },
            { label: 'On Trip', value: onTripVeh, tone: 'bg-cyan-400' },
            { label: 'In Shop', value: inShopVeh, tone: 'bg-amber-400' },
            { label: 'Retired', value: retiredVeh, tone: 'bg-rose-400' }
        ]

        const activeTripsList = await Trip.find({ status: { $in: ['Assigned', 'In Transit'] } })
            .populate('assignedDriver', 'name')
            .populate('assignedVehicle', 'vehicleName registrationNumber')
            .sort({ createdAt: -1 })
            .limit(5);

        const activeTrips = activeTripsList.map(t => ({
            tripId: t._id.toString().substring(18).toUpperCase(),
            route: `${t.source} to ${t.destination}`,
            vehicle: t.assignedVehicle ? `${t.assignedVehicle.vehicleName} (${t.assignedVehicle.registrationNumber})` : 'Unassigned',
            driver: t.assignedDriver ? t.assignedDriver.name : 'Unassigned',
            status: t.status
        }));

        const totalCostObj = await Vehicle.aggregate([
            { $group: { _id: null, total: { $sum: '$acquisitionCost' } } }
        ]);
        const totalInvestment = totalCostObj.length > 0 ? totalCostObj[0].total : 4500000;
        const costSummary = [
            { label: 'Acquisition Capital', value: `Rs. ${totalInvestment.toLocaleString()}`, detail: 'Total capital invested in registered fleet vehicles' },
            { label: 'Operational Runrate', value: `Rs. ${(activeTripsCount * 4500).toLocaleString()}`, detail: 'Estimated route fuel and driver payout runrate' }
        ];

        const complianceAlerts = [];
        const expiredDrivers = drivers.filter(d => !d.licenseValid);
        if (expiredDrivers.length > 0) {
            complianceAlerts.push(`License Compliance Check: ${expiredDrivers.length} drivers have expired licenses.`);
        } else {
            complianceAlerts.push('All active driver licenses are verified and valid.');
        }
        const shopVehicles = await Vehicle.countDocuments({ status: 'In Shop' });
        if (shopVehicles > 0) {
            complianceAlerts.push(`Maintenance Flag: ${shopVehicles} vehicles are flagged inside shop inspection.`);
        } else {
            complianceAlerts.push('Zero critical vehicle maintenance alerts flagged.');
        }

        const regions = ['North', 'South', 'East', 'West', 'Central'];
        const regionPerformance = await Promise.all(regions.map(async (reg) => {
            const totalRegVeh = await Vehicle.countDocuments({ region: reg });
            const availableRegVeh = await Vehicle.countDocuments({ region: reg, status: 'Available' });
            const regTrips = await Trip.countDocuments({ region: reg });
            const utilization = totalRegVeh > 0 ? `${Math.round(((totalRegVeh - availableRegVeh) / totalRegVeh) * 100)}%` : '0%';
            return {
                region: reg,
                utilization: `Utilization: ${utilization}`,
                available: `${availableRegVeh} of ${totalRegVeh} vehicles available`,
                trips: `${regTrips} total trips dispatched`
            };
        }));

        return res.status(200).json({
            kpiCards,
            fleetOverview,
            activeTrips,
            complianceAlerts,
            costSummary,
            regionPerformance
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

const getDriverDashboard = async (req, res) => {
    try {
        const driverId = req.user._id;

        // Query active assigned trips
        const assignedTripsList = await Trip.find({
            assignedDriver: driverId,
            status: { $in: ['Assigned', 'In Transit'] }
        }).populate('assignedVehicle');

        const dailyMetrics = [
            { label: 'My Active Trips', value: `${assignedTripsList.length} Active` },
            { label: 'My Safety Rating', value: `${req.user.safetyScore || 95}/100` },
            { label: 'Dispatch Region', value: req.user.driverRegion || 'North' },
            { label: 'Licensing Status', value: req.user.licenseValid ? 'Valid' : 'Expired' }
        ];

        const inboxNotifications = assignedTripsList.map(t => ({
            title: 'New Trip Dispatched',
            detail: `Route: ${t.source} to ${t.destination}. Window: ${t.dispatchWindow}. Date: ${t.dispatchDate.toISOString().split('T')[0]}. Vehicle: ${t.assignedVehicle ? t.assignedVehicle.registrationNumber : 'N/A'}.`,
            tone: 'border-cyan-200 bg-cyan-50 text-cyan-950'
        }));

        if (inboxNotifications.length === 0) {
            inboxNotifications.push({
                title: 'Driver Status: Standby',
                detail: 'You are registered and available in the dispatch pool. Matching trips will populate here.',
                tone: 'border-slate-200 bg-slate-50 text-slate-700'
            });
        }

        const assignedTrips = assignedTripsList.map(t => ({
            tripId: t._id.toString().substring(18).toUpperCase(),
            route: `${t.source} to ${t.destination}`,
            vehicle: t.assignedVehicle ? `${t.assignedVehicle.vehicleName} (${t.assignedVehicle.registrationNumber})` : 'Unassigned',
            window: `${t.dispatchDate.toISOString().split('T')[0]} | ${t.dispatchWindow}`,
            status: t.status
        }));

        const tripChecklist = [
            'Perform vehicle standard walkaround check.',
            'Confirm weight checks stay within truck specifications.',
            'Check that licensing and insurance documentation are in order.',
            'Verify destination address and route navigations.'
        ];

        return res.status(200).json({
            driverName: req.user.name,
            dailyMetrics,
            inboxNotifications,
            assignedTrips,
            tripChecklist
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

const getUserPortal = async (req, res) => {
    try {
        const userId = req.user._id;

        // Query user's trip requests
        const totalUserTrips = await Trip.countDocuments({ createdBy: userId });
        const activeUserTrips = await Trip.countDocuments({ createdBy: userId, status: { $in: ['Assigned', 'In Transit'] } });

        const userMetrics = [
            { label: 'My Total Requests', value: `${totalUserTrips} Requested` },
            { label: 'Active In-Transit', value: `${activeUserTrips} Trips` },
            { label: 'Portal Mode', value: 'Operations Portal' },
            { label: 'Authorized Role', value: req.user.role.toUpperCase() }
        ];

        const quickActions = [
            {
                title: 'Request a New Trip',
                detail: 'Define route, load weight, region and dispatch details to automatically match drivers.',
                to: '/new-trip'
            },
            {
                title: 'Open Admin Dashboard',
                detail: 'Monitor overall fleet assets, costs, and compliance pulses.',
                to: '/admin'
            }
        ];

        const userTrips = await Trip.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .limit(5);

        const requestHistory = userTrips.map(t => ({
            tripId: t._id.toString().substring(18).toUpperCase(),
            route: `${t.source} to ${t.destination}`,
            requestedAt: t.createdAt.toISOString().split('T')[0],
            status: t.status
        }));

        const backendNotes = [
            'Trip matching uses automatic scoring based on driver safety ratings.',
            'Expired driver licenses will lock assignments to prevent compliance warnings.',
            'Cargo load weights must align with maximum truck capacity bounds.',
            'Assigned vehicles cannot accept concurrent dispatches.'
        ];

        return res.status(200).json({
            userMetrics,
            quickActions,
            requestHistory,
            backendNotes
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    getAdminDashboard,
    getDriverDashboard,
    getUserPortal
};
