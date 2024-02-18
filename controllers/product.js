const { StatusCodes } = require('http-status-codes')
const asyncWrapper = require('../middleware/async');
const Product = require('../models/products')
const { monthNameToDoubleDigit, getRandomColor } = require('../utils/helperFunctions')


const initializeDatabase = asyncWrapper(async (req,res,next) =>{
    const response =  await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const seedData = response.data;
    await Product.insertMany(seedData);
    res.status(200).json({msg:"Database initialized"})

})

// Get products based on month , search , page number
const getProducts = asyncWrapper(async (req, res, next) => {
    const { month, search } = req.query
    const queryObject = {};
    if (search) {
        const numericPrice = parseFloat(search);

        // Check if the user-provided value is a valid numeric value
        if (!isNaN(numericPrice)) {
            queryObject.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { price: numericPrice }, // Include the price condition only if search is numeric
            ];
        } else {
            // Check if the user-provided value is not a valid numeric value
            queryObject.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }
    }

    let monthNumber = monthNameToDoubleDigit(month)

    monthNumber = monthNumber.toString()

    let result = Product.find(queryObject).where('dateOfSale').regex(new RegExp(`^.{5}${monthNumber}`))

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const product = await result
    if (!product) {
        const error = new CustomAPIError('No product found', StatusCodes.NOT_FOUND)
        return next(error)
    }
    res.status(StatusCodes.OK).json(product)
})

// get data for statistics
const getStatistics = asyncWrapper(async (req, res, next) => {
    const { month } = req.query
    let monthNumber = monthNameToDoubleDigit(month)

    monthNumber = monthNumber.toString()

    let result = await Product.where('dateOfSale').regex(new RegExp(`^.{5}${monthNumber}`)).exec()
    const statsgraph = {
        Total_sale: 0,
        Total_sold_item: 0,
        Total_not_sold_item: 0,
    };
    for (let p of result) {
        if (p.sold === true) {
            statsgraph.Total_sold_item++;
            statsgraph.Total_sale += p.price
        }
        else {
            statsgraph.Total_not_sold_item++
        }
    }
    const data = statsgraph
    res.status(StatusCodes.OK).json({ stats: data })


})


// get data for bar graph
const getBarGraph = asyncWrapper(async (req, res, next) => {
    const { month } = req.query
    let monthNumber = monthNameToDoubleDigit(month)

    monthNumber = monthNumber.toString()

    let result = await Product.where('dateOfSale').regex(new RegExp(`^.{5}${monthNumber}`)).exec()
    const range = new Array(10).fill(0);
    for (let p of result) {
        let price = Math.floor(p.price);
        if (price === 0) { range[0]++ }
        else if (price > 900) { range[9]++ }
        else {
            range[Math.floor((price - 1) / 100)]++;
        }
    }
    const labels = ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901 above'];
    const data2 = {
        data: range,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,

    };

    const data = {
        labels: labels,

        datasets: [
            data2
        ],
    }


    res.status(200).json({ bar: data })

})


// get data for pie graph
const getPieGraph = asyncWrapper(async (req, res, next) => {
    const { month } = req.query
    const myDict = {};
    let monthNumber = monthNameToDoubleDigit(month)

    monthNumber = monthNumber.toString()

    let result = await Product.where('dateOfSale').regex(new RegExp(`^.{5}${monthNumber}`)).exec()
    for (let p of result) {
        if (myDict[p.category]) {
            myDict[p.category]++;
        }
        else {
            myDict[p.category] = 1;
        }
    }

    const categories = Object.keys(myDict);
    const values = Object.values(myDict);
    const randomColors = Array.from({ length: categories.length }, () => getRandomColor());
    const labels = categories
    const data2 = {
        data: values,
        backgroundColor: randomColors,
    };

    const data = {
        labels: labels,
        datasets: [
            data2
        ]
    }

    res.status(200).json({ pie: data })

})


// combined API for all graphs
const getAllGraph = asyncWrapper(async (req, res, next) => {
    const { month } = req.query
    const statisticsAPIResponse = await fetch(`http://localhost:5000/getgraphs/getStatistics?month=${month}`)
    const barChartAPIResponse = await fetch(`http://localhost:5000/getgraphs/getbargraph?month=${month}`)
    const pieChartAPIResponse = await fetch(`http://localhost:5000/getgraphs/getpiegraph?month=${month}`)

    const [statisticsData, barChartData, pieChartData] = await Promise.all([
        statisticsAPIResponse.json(),
        barChartAPIResponse.json(),
        pieChartAPIResponse.json()
    ]);



    const data = {
        ...statisticsData,
        ...barChartData,
        ...pieChartData
    };

    res.status(200).json(data)
})





module.exports = {
    getProducts, getAllGraph, getStatistics, getPieGraph, getBarGraph,initializeDatabase
}