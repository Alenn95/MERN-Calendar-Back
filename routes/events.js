/* Events routes
/api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { valueJWT } = require('../middlewares/validar-jwt')
const { validarCampos } = require('../middlewares/checkValidations');
const { isDate } = require('../helpers/isDate')
const { getEvent, createEvent, refreshEvents, deleteEvent } = require('../controllers/events');
const router = Router();



//todas tienes que pasar por la validacion del jwt
router.use(valueJWT);


// Obtener eventos 
router.get('/',
    [
        check('title', 'Debe haber un titulo').not().isEmpty(),
        validarCampos,
        valueJWT
    ], getEvent)


//crear un nuevo evento
router.post('/',
    [
        check('title', 'Debe haber un titulo').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),

        validarCampos,
        valueJWT
    ], createEvent)


//Actualizar Evento

router.put('/:id',
    [
        // check('title', 'Debe haber un titulo').not().isEmpty(),
        validarCampos,
        valueJWT
    ], refreshEvents)



//Borrar evento

router.delete('/:id',
    [
        check('title', 'Debe haber un titulo').not().isEmpty(),
        validarCampos,
        valueJWT
    ], deleteEvent)


module.exports = router;
