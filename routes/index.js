var express = require("express");
const { hashdata, comparehashdata } = require("../bcrypt");
var router = express.Router();
const nodemailer = require("nodemailer");

const Patients = require("../Schema/Patients");
const booktest = require("../Schema/booktest");
const bookappointment = require("../Schema/bookappointment");
const bills = require("../Schema/bills");
const doctorlogin = require("../Schema/doctorlogin");
const res = require("express/lib/response");

// post,put method = req.body
// get = req.query
// URL GET params.
// req.params for all (post,get,put)

router.post("/userlogin", async (req, res, next) => {
  try {
    console.log(req.body);
    console.log("------------------------", req.body);
    console.log("------------------------", req.body.email);
    console.log("------------------------", req.body.password);
    const validemail = await Patients.findOne({ email: req.body.email });
    if (!!validemail) {
      const validpassword = await comparehashdata(
        req.body.password,
        validemail.password
      );
      if (validpassword) {
        console.log(validemail);
        res.json({
          message: "OK",
          email: validemail.email,
          name: validemail.name,
          phoneno: validemail.phoneno,
          id: validemail._id,
        });
      } else
        res.json({
          message: "Invalid Password",
        });
    } else {
      res.json({
        message: "Invalid Email/Not Exist",
      });
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/userlogin", async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rishabhdjango@gmail.com", // generated ethereal user
        pass: "newyork@123",
      },
    });

    const mailOptions = {
      from: "rishabhdjango@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: "Alert",
      text: `Hello ${req.body.name} ,An attempt to login was made into your account, ignore if it was you.`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else {
        console.log("Info :");
        console.log(info);
        res.sendStatus(200);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

router.post("/doctor/login", async (req, res, next) => {
  try {
    console.log(req.body);
    console.log("------------------------", req.body);
    console.log("------------------------", req.body.email);
    console.log("------------------------", req.body.password);
    const validemail = await doctorlogin.findOne({ email: req.body.email });
    if (!!validemail) {
      const validpassword = await comparehashdata(
        req.body.password,
        validemail.password
      );
      if (validpassword) {
        console.log(validemail);
        res.json({
          message: "OK",
          email: validemail.email,
          name: validemail.name,
        });
      } else
        res.json({
          message: "Invalid Password",
        });
    } else {
      res.json({
        message: "Invalid Email/Not Exist",
      });
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const data = req.body;
    console.log("-------------------------------", data.email);
    console.log("-------------------------------", data.password);
    const validemail = await Patients.findOne({ email: data.email });
    console.log(validemail);
    if (!!validemail) {
      res.send("Email already exists");
    } else {
      data.password = await hashdata(data.password);
      console.log("-----------------------------Data", data);
      const result = await Patients.create(data);
      console.log("-----------------------------Results", result);

      console.log(!!result);
      if (!!result) {
        next();
        // res.sendStatus(200)
      } else res.status(401).json({ errormessage: "Invalid Signin Process.." });
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/doctor/signup", async (req, res, next) => {
  try {
    const data = req.body;
    console.log("-------------------------------", data.email);
    console.log("-------------------------------", data.password);
    const validemail = await doctorlogin.findOne({ email: data.email });
    console.log(validemail);
    if (!!validemail) {
      res.send("Email already exists");
    } else {
      data.password = await hashdata(data.password);
      console.log("-----------------------------Data", data);
      const result = await doctorlogin.create(data);
      console.log("-----------------------------Results", result);
      console.log("doctor got registered.....")
      console.log(!!result);
      if (!!result) {
        next();
        // res.sendStatus(200)
      } else res.status(401).json({ errormessage: "Invalid Signin Process.." });
    }
  } catch (error) {
    res.send(error);
  }
});

//welcome mail
router.post("/signup", async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rishabhdjango@gmail.com", // generated ethereal user
        pass: "newyork@123",
      },
    });

    const mailOptions = {
      from: "rishabhdjango@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: "Account Created",
      text: `Hi ${req.body.name} , We warmly welcome you to our family...`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else {
        console.log("Info :");
        console.log(info);
        res.sendStatus(200);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

router.post("/bookappointment/:id", async (req, res, next) => {
  try {
    console.log("-----------------------------", req.params.id);
    console.log("++++++++++++++++++++++++++", req.body.name);
    console.log("++++++++++++++++++++++++++", req.body.email);
    console.log("++++++++++++++++++++++++++", req.body.symptoms);
    console.log("++++++++++++++++++++++++++", req.body.date);
    console.log("++++++++++++++++++++++++++", req.body.time);
    console.log("++++++++++++++++++++++++++", req.body.doctor);
    console.log(req.body);
    const result = await bookappointment.create(req.body);
    console.log(result);
    console.log("inserted check your database");
    const bil = await bills.create({
      in: `${req.body.doctor} Doctor`,
      name: req.body.name,
      email: req.body.email,
      amount: 500,
    });
    console.log(bil);
    console.log("Bill is created....");
  } catch (error) {
    res.send(error);
  }
});

router.post("/booktest/:id", async (req, res, next) => {
  console.log("calling.....");
  try {
    console.log("-----------------------------", req.params.id);
    console.log("++++++++++++++++++++++++++", req.body.name);
    console.log("++++++++++++++++++++++++++", req.body.email);
    console.log("++++++++++++++++++++++++++", req.body.test);
    console.log(req.body);
    const result = await booktest.create(req.body);
    // const bills = await bills.create(req.body);
    console.log(result);
    console.log("inserted test check your database");
    const bil = await bills.create({
      in: `${req.body.test} Test`,
      name: req.body.name,
      email: req.body.email,
      amount: 200,
    });
    console.log(bil);
  } catch (error) {
    res.send(error);
  }
});

router.get("/viewmyappointmentstatus/id", async (req, res, next) => {
  console.log("calling.....");
  try {
    console.log("-----------------------------", req.params.id);
    console.log("++++++++++++++++++++++++++", req.body.name);
    console.log("++++++++++++++++++++++++++", req.body.email);
    console.log("++++++++++++++++++++++++++", req.body.test);
    console.log(req.body);
    const result = await booktest.find({ id: req.params.email });
    console.log(result);
    console.log("inserted test check your database");
  } catch (error) {
    res.send(error);
  }
});

router.get("/viewmybill/:id", async (req, res, next) => {
  await bills
    .find({ _email: req.params.email })
    .sort({ _id: -1 })
    .then((result) =>
      res.status(200).json({
        bills: result,
      })
    )
    .catch((error) => {
      console.log(error);
      res.status(500).json({});
    });
});

router.get("/viewmyappointmentstatus/:id", async (req, res, next) => {
  await bills
    .findOne({ _email: req.params.email, _in: "/.*Doctor.*/" })
    .sort({ _id: -1 })
    .then((result) =>
      res.status(200).json({
        bills: result,
      })
    )
    .catch((error) => {
      console.log(error);
      res.status(500).json({});
    });
});

router.get("/viewmytestbooking/:id", async (req, res, next) => {
  await bills
    .findOne({ _email: req.params.email, _in: "/*Test/" })
    .sort({ _id: -1 })
    .then((result) =>
      res.status(200).json({
        bills: result,
      })
    )
    .catch((error) => {
      console.log(error);
      res.status(500).json({});
    });
});

router.get("/dummy", async (req, res) => {
  console.log("dummy......");
  res.send("this is ssent frim dummyl......");
});

// router.get("/complaintlist/:id", async (req, res, next) => {
//   try {
//     const result = await complaintschema
//       .find({ status: "pending" })
//       .sort({ createdAt: -1 });
//     if (result)
//       res.json({
//         message: "OK",
//         value: result,
//       });
//   } catch (error) {
//     res.send(error);
//   }
// });

module.exports = router;

/* GET user home page. */
// router.get("/:id", async (req, res, next) => {
//   try {
//     // const result = await bootcampschema.find().sort({ orgdate: 1 });
//     const result1 = await Patients.find(
//       { _id: req.params.id },
//       { userlists: 1 }
//     ).sort({ orgdate: 1 });
//     if (result) {
//       res.json({
//         message: "OK",
//         bootlist: result,
//         registeredbootcamp: result1,
//       });
//     } else {
//       res.json({
//         message: "Sorry for inconvience.kindly contact our support",
//       });
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// router.post("/:id", async (req, res, next) => {
//   // const result = await bookappointment.find()
//   const data = req.body;
//   const result = await bookappointment.create(data);
//   console.log("-----------------------------Results", result);
// });

// /* GET home page. */
// router.get("/", async (req, res, next) => {
//   try {
//     const result = await Patients.find()
//     const result1 = await Patients.find(
//       { _id: req.params.id },
//       { userlists: 1 }
//     ).sort({ orgdate: 1 });
//     if (result) {
//       res.json({
//         message: "OK",
//         bootlist: result,
//         registeredbootcamp: result1,
//       });
//     } else {
//       res.json({
//         message: "Sorry for inconvience.kindly contact our support",
//       });
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// /* GET bootcamp list for admin. */
// router.get("/adminhomepage/:id", async (req, res, next) => {
//   try {
//     console.log(req.body);
//     // const result = await bootcampschema.find().sort({ orgdate: 1 });
//     console.log(result);
//     if (result) {
//       res.json({
//         message: "OK",
//         bootlist: result,
//       });
//     } else {
//       res.json({
//         message: "Sorry for inconvience.kindly contact our support",
//       });
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// /* retrive specific bootcamp. */
// router.get("/bootcamp/:id", async (req, res, next) => {
//   try {
//     // const result = await bootcampschema.findOne({ _id: req.params.id });
//     if (result) {
//       res.json({
//         message: "OK",
//         bootlist: result,
//       });
//     } else {
//       res.json({
//         message: "Sorry for inconvience.kindly contact our support",
//       });
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// });
// /* user status verification. */
// // router.put("/bootcamp/:id", async (req, res, next) => {
// //   try {
// //     // const findbootcamp = await bootcampschema.findOneAndUpdate(
// //       // { _id: req.params.id, "userlists.email": req.body.email },
// //       // { "userlists.$.status": "verified" }
// //     // );
// //     if (findbootcamp) {
// //       next();
// //     }
// //   } catch (error) {
// //     console.error(error.message);
// //   }
// // });

// /* user status verification. */
// // router.put("/bootcamp/:id", async (req, res, next) => {
// //   try {
// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: "rishabhdjango@gmail.com", // generated ethereal user
// //         pass: "newyork@123",
// //       },
// //     });

// //     const mailOptions = {
// //       from: "rishabhdjango@gmail.com", // sender address
// //       to: req.body.email, // list of receivers
// //       subject: `${req.body.bname} BootCamp Transcation Verification`,
// //       text: `Hi ${req.body.name},Your transcation has been verified. Hope all Safe!  `,
// //     };
// //     transporter.sendMail(mailOptions, function (err, info) {
// //       if (err) console.log(err);
// //       else {
// //         console.log("Info :");
// //         console.log(info);
// //         res.json({
// //           message: "OK",
// //         });
// //       }
// //     });
// //   } catch (error) {
// //     console.error(error.message);
// //   }
// // });

// /* update userlist  */
// router.put("/", async (req, res, next) => {
//   try {
//     const result = await Patients.findOneAndUpdate(
//       { email: req.body.userdata.email },
//       { $push: { userlists: req.body.bootcampdata } }
//     );
//     // const result1 = await bootcampschema.findOneAndUpdate(
//     //   { _id: req.body.id },
//     //   { $push: { userlists: req.body.userdata } }
//     // );

//     if (!!result && !!result1) {
//       res.json({
//         message: "OK",
//       });
//       next();
//     } else
//       res.json({
//         message: "Error Occured..Try Again",
//       });
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// /* bootcamp register approval mail */
// // router.put("/", async (req, res, next) => {
// //   try {
// //     // const result = await bootcampschema.findOne({ _id: req.body.id });

// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: "rishabhdjango@gmail.com", // generated ethereal user
// //         pass: "newyork@123",
// //       },
// //     });

// //     const mailOptions = {
// //       from: "rishabhdjango@gmail.com", // sender address
// //       to: req.body.userdata.email, // list of receivers
// //       subject: `${result.name} BootCamp Registed Successfully`,
// //       text: `Hi ${req.body.userdata.name} , thanks for ${result.name} BootCamp. We will verify your transaction details and contact you. All the best..Hope you all Safe!`,
// //     };
// //     transporter.sendMail(mailOptions, function (err, info) {
// //       if (err) console.log(err);
// //       else {
// //         console.log("Info :");
// //         console.log(info);
// //       }
// //     });
// //   } catch (error) {
// //     console.error(error.message);
// //   }
// // });

// //post for createuser account
//
// // verify userlogin account
// router.post("/userlogin", async (req, res, next) => {
//   try {
//     console.log(req.body);
//     console.log("------------------------", req.body);
//     console.log("------------------------", req.body.email);
//     console.log("------------------------", req.body.password);
//     const validemail = await Patients.findOne({ email: req.body.email });
//     if (!!validemail) {
//       const validpassword = await comparehashdata(
//         req.body.password,
//         validemail.password
//       );
//       if (validpassword) {
//         console.log(validemail);
//         res.json({
//           message: "OK",
//           email: validemail.email,
//           name: validemail.name,
//           phoneno: validemail.phoneno,
//           id: validemail._id,
//         });
//       } else
//         res.json({
//           message: "Invalid Password",
//         });
//     } else {
//       res.json({
//         message: "Invalid Email/Not Exist",
//       });
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

// // verify adminlogin account
// router.post("/adminlogin", async (req, res, next) => {
//   try {
//     const validemail = await adminschema.findOne({ email: req.body.email });
//     console.log(validemail);
//     if (!!validemail) {
//       if (req.body.password === validemail.password) {
//         res.json({
//           message: "OK",
//         });
//       } else
//         res.json({
//           message: "Invalid Password",
//         });
//     } else {
//       res.json({
//         message: "Invalid Email/Not Exist",
//       });
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

// // forgotpassword
// router.put("/forgotpassword", async (req, res, next) => {
//   try {
//     const validemail = await Patients.findOne({ email: req.body.email });
//     if (!!validemail) {
//       const result = await Patients.findOneAndUpdate(
//         { email: req.body.email },
//         { password: await hashdata(req.body.password) }
//       );
//       console.log(result);
//       if (result)
//         res.json({
//           message: "OK",
//         });
//     } else {
//       res.json({
//         message: "Invalid Email/Not Exist",
//       });
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

// //insert campdetails in mongodb
// router.post("/addcamp", async (req, res, next) => {
//   try {
//     // const isnameexist = await bootcampschema.findOne({ name: req.body.name });
//     if (!!isnameexist) {
//       res.json({
//         message: "Bootcamp already exist..Try another name",
//       });
//     } else {
//       // const result = await bootcampschema.create(req.body);
//       if (result)
//         res.json({
//           message: "OK",
//         });
//       else
//         res.json({
//           message: "Error Occured.Try Again",
//         });
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

// //store complaints
// router.post("/support", async (req, res, next) => {
//   try {
//     const result = await complaintschema.create(req.body);
//     const ticketid = result._id.toString();
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "rishabhdjango@gmail.com", // generated ethereal user
//         pass: "newyork@123",
//       },
//     });

//     const mailOptions = {
//       from: "rishabhdjango@gmail.com", // sender address
//       to: req.body.email, // list of receivers
//       subject: `Complaint Regsitered`,
//       text: `Sorry for the Inconivence.we will support and clear this issue as soon as possible.

//       Your ticket is ${ticketid}  `,
//     };
//     transporter.sendMail(mailOptions, function (err, info) {
//       if (err) console.log(err);
//       else {
//         console.log("Info :");
//         console.log(info);
//         res.json({
//           message: "OK",
//         });
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// //store complaints
// router.get("/complaintlist/:id", async (req, res, next) => {
//   try {
//     const result = await complaintschema
//       .find({ status: "pending" })
//       .sort({ createdAt: -1 });
//     if (result)
//       res.json({
//         message: "OK",
//         value: result,
//       });
//   } catch (error) {
//     res.send(error);
//   }
// });

// //update complaint status
// router.put("/complaintlist/:id", async (req, res, next) => {
//   try {
//     const result = await complaintschema.findOneAndUpdate(
//       { _id: req.body.id },
//       { status: "resolved" }
//     );
//     console.log(result);
//     if (result) {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "rishabhdjango@gmail.com", // generated ethereal user
//           pass: "newyork@123",
//         },
//       });

//       const mailOptions = {
//         from: "rishabhdjango@gmail.com", // sender address
//         to: req.body.email, // list of receivers
//         subject: `Complaint Resolved`,
//         text: `Your Complaint has been resolved.

//       Your ticket is ${req.body.id}.

//       Thank you..Hope ALL safe`,
//       };
//       transporter.sendMail(mailOptions, function (err, info) {
//         if (err) console.log(err);
//         else {
//           console.log("Info :");
//           console.log(info);
//           res.json({
//             message: "OK",
//           });
//         }
//       });
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

// module.exports = router;
