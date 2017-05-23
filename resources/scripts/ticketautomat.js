var activeTicket = null;
var baseImgPath = "/resources/images/icons/";

$(document).ready(function () {

	$("#tickets").on('click', ".ticket", onTicketClick);

	$("#controls").on('click', ".control-option", onFeatureChange);

	$("#route").on('change', "input", onRouteChange);

	$("#favoriteTickets").on('click', ".ticket", onFavoriteTicketClick);

});

function onTicketClick(event) {
	var ticket = $(event.currentTarget);
	activeTicket = ticket;

	var from = ticket.find(".from")[0].dataset.value;
	var to = ticket.find(".to")[0].dataset.value;

	var editor = $('#editor');
	editor.find("input[name='from']").val(from);
	editor.find("input[name='to']").val(to);

	var features = ticket.find('.feature');
	for (var index = 0; index < features.length; index++) {
		var feature = features[index].dataset.feature;
		var value = features[index].dataset.value;
		setEditorFeature(feature, value);
	}

	editor.show();
}

function onFeatureChange(event) {
	var feature = $(event.currentTarget).parents('.control')[0].dataset.feature;
	var value = event.currentTarget.dataset.value;

	var activeButton = $(event.currentTarget);
	var inactiveButton = activeButton.siblings();

	activeButton.addClass('active');
	inactiveButton.removeClass('active');

	setTicketFeature(feature, value);

	var price = activeTicket[0].dataset.baseprice;
	var activeFeatures = $(".control-option.active");
	for (var index = 0; index < activeFeatures.length; index++) {
		price *= activeFeatures[index].dataset.pricefactor;
	}
	price = getValidPrice(price);

	setActiveTicketPrice(price, false);
}

function setEditorFeature(feature, value) {
	console.log("Set " + feature + " = " + value);

	var editor = $('#editor');

	var activeButton = editor.find(".control-option[data-value='" + value + "']");
	var inactiveButton = activeButton.siblings();

	activeButton.addClass('active');
	inactiveButton.removeClass('active');
}

function setTicketFeature(feature, value) {
	if (activeTicket !== null) {

		var featureItem = activeTicket.find(".feature[data-feature='" + feature + "']");
		var img = featureItem.children('img');

		img.attr('src', baseImgPath + value + ".png");
	}
}

function onRouteChange(event) {
	var input = event.currentTarget;
	var type = input.name;

	var target = activeTicket.find("." + type)[0];

	target.innerText = input.value;
	target.dataset.value = input.value;

	setActiveTicketPrice(getRandomPrice(), true);
}

function cloneActiveTicket() {
	var clone = activeTicket.clone();
	addTicket(clone);
}

function removeTicket() {
	activeTicket.remove();
	calcTotalPrice();

	if ($("#tickets").find(".ticket").length === 0) {
		$("#editor").hide();
		$("#mainArea-start").show();
	}
}

function setActiveTicketPrice(price, changeBasePrice) {
	activeTicket.find(".price p")[0].innerText = price;

	if (changeBasePrice) {
		activeTicket[0].dataset.baseprice = price;
	}

	calcTotalPrice();
}

function calcTotalPrice() {
	var tickets = $('#tickets').find('.ticket');
	var total = 0;
	for (var index = 0; index < tickets.length; index++) {
		total += parseFloat($(tickets[index]).find(".price p")[0].innerText);
	}

	if (total > 0) {
		$('#totalAmount')[0].innerText = total.toFixed(2);

		var totalLine = $('#total');
		if (!totalLine.is(":visible")) {
			totalLine.fadeIn();
		}
	} else {
		$('#total').fadeOut();
	}

}

function getRandomPrice() {
	return getValidPrice(Math.random() * 100);
}

function getValidPrice(price) {
	return (Math.ceil(price * 20) / 20).toFixed(2)
}

function addTicket(ticket) {
	activeTicket = ticket;
	activeTicket.removeAttr('style');
	ticket.addClass('invisibleTicket');
	ticket.appendTo("#tickets");
	ticket.slideDown();

	$('#tickets').animate({
		scrollTop: ticket.offset().top
	}, 500);

	calcTotalPrice();
}


function onFavoriteTicketClick(event) {
	var ticket = $(event.currentTarget).clone();
	addTicket(ticket);
	$("#mainArea-start").hide();
	activeTicket.click();
}