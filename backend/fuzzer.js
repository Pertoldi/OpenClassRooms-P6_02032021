const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const helmet = require('helmet');

function fuzz(buf) {
	try {
		//http.decode(buf);
		express.decode(buf);
		//mongoose.decode(buf);

	} catch (error) {
		throw error;
	}
}

module.exports = {
	fuzz
};