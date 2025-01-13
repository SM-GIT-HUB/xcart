import orderModel from "../lib/database/models/order.model.js"
import productModel from "../lib/database/models/product.model.js"
import userModel from "../lib/database/models/user.model.js"

async function analyticsData(req, res)
{
    try {
        const analyticsData = await getAnalytics();

        const endDate = new Date();
        const startDate = new Date(endDate - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.status(200).json({ analyticsData, dailySalesData });
    }
    catch(err) {
        console.log("error in analyticsdata:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function getAnalytics()
{
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    const salesData = await orderModel.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ])

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    return { totalUsers, totalProducts, totalSales, totalRevenue };
}

async function getDailySalesData(startDate, endDate)
{
    const dailySalesData = await orderModel.aggregate([
        { $match: { $createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: 1 },
                revenue: { $sum: "$totalAmount" }
            }
        },
        { $sort: { _id: 1 } }
    ])

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((d) => {
        const foundData = dailySalesData.find((it) => it._id == date);

        return { date, sales: foundData?.sales || 0, revenue: foundData?.revenue || 0 };
    })
}

function getDatesInRange(startDate, endDate)
{
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate)
    {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}


export { analyticsData }