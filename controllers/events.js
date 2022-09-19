const { response } = require('express')
const Event = require('../models/Event')

const getEvent = async (req, res = response) => {


    const events = await Event.find().populate('user', 'name');



    res.status(201).json({
        ok: true,
        events
    });


}


const createEvent = async (req, res = response) => {


    const event = Event(req.body);



    try {

        event.user = req.uid

        const savedEvent = await event.save();

        res.json({
            ok: true,
            event: savedEvent
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}


const refreshEvents = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId)

        if (!event) {
           return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(404).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const refreshedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

        res.status(201).json({
            ok: true,
            msg: 'Evento actualizado',
            refreshedEvent
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mag: 'Hable con el admin'
        })
    }


}


const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId)

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(404).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }


        const erasedEvent = await Event.findByIdAndDelete(eventId)

        res.status(201).json({
            ok: true,
            msg: 'Evento borrado',
           erasedEvent
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mag: 'Hable con el admin'
        })
    }

}


module.exports = {
    deleteEvent,
    refreshEvents,
    createEvent,
    getEvent
}




