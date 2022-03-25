

const bcrypt = require('bcryptjs')


const hashdata = async (password) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    } catch (error) {
        console.error(error);
    }
}

const comparehashdata = async (pwd, hashedPwd) => {
    try {
        return bcrypt.compareSync(pwd, hashedPwd)
    } catch (err) {
        console.error(err)

    }
}


module.exports = { hashdata, comparehashdata }