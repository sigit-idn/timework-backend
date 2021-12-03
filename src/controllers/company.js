const Company = require("../models/company");

exports.addCompany = (req, res) => {
  const { body } = req;
  const company = new Company(body);
  company
    .save()
    .then((data) => {
      return res.status(201).json({
        message: "Company added successfully",
        data,
      });
    })
    .catch((error) => {
      return res.json({
        error,
      });
    });
};

exports.getCompanies = async (req, res) => {
  return res.status(200).json({
    message: "Get Companies successfully",
    data: await Company.find(),
  });
};

exports.getCompany = async (req, res) => {
  return res.status(200).json({
    message: "Get Company successfully",
    data: await Company.findById(req.params.id),
  });
};

exports.editCompany = async (req, res) => {
  // const { name, phone, email, role, address, attendance } = req.body;
  const { body } = req;
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, body);

    return res.json({
      message: "Company edited successfully",
      data: body,
    });
  } catch (error) {
    return res.json({
      error,
    });
  }
};

exports.deleteCompany = (req, res) => {
  Company.findByIdAndDelete(req.params.id)
    .then((data) => {
      return res.json({
        message: "Company deleted successfully",
        data,
      });
    })
    .catch((error) => {
      return res.json({
        error,
      });
    });
};
