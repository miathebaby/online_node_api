const Company = require('../models/company');

exports.index = async (req, res, next) => {
    const company = await Company.findOne();
    res.status(200).json({ data: company });
};

// exports.index = (req, res, next) => {
//     res.status(200).json({
//         data: {
//             name: 'Company 1',
//             address: {
//                 street: 'Company 1 Street',
//                 city: 'Company 1 City',
//                 state: 'Company 1 State',
//                 zip: 'Company 1 Zip',
//                 country: 'Company 1 Country',
//             },
//             phone: 'Company 1 Phone',
//             email: 'Company 1 Email',
//             website: 'Company 1 Website',
//             logo: 'Company 1 Logo',
//             description: 'Company 1 Description',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         }
//     });
// };
