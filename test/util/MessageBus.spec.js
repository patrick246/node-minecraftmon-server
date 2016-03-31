import MessageBus from '../../dist/util/MessageBus';
import chai from 'chai';
var should = chai.should();

describe("MessageBus", () =>
{
	let messageBus;

	beforeEach(() =>
	{
		messageBus = new MessageBus;
	});

	it("should not be null", () =>
	{
		messageBus.should.not.be.null;
	});

	it("should register a message handler", () =>
	{
		function myHandler(evData)
		{
		}

		messageBus.registerHandler("test.event", myHandler);
		messageBus.getHandlers("test.event").should.have.length(1);
		messageBus.getHandlers("test.event")[0].should.be.equal(myHandler);
	});

	it("should call my event handler", (done) =>
	{
		function myHandler(evData)
		{
			done();
		}

		messageBus.registerHandler("test.event", myHandler);
		messageBus.emit("test.event", {});
	});

	it("should remove my handler", () =>
	{
		function myHandler(evData)
		{
		}

		messageBus.registerHandler("test.event", myHandler);
		messageBus.getHandlers("test.event").should.have.length(1);
		messageBus.deleteHandler("test.event", myHandler);
		messageBus.getHandlers("test.event").should.have.length(0);
	});

	it("should not fail on null event index", (done) =>
	{
		messageBus.registerHandler(null, () =>
		{
			done();
		});
		messageBus.getHandlers(null).should.have.length(1);
		messageBus.emit(null);
	});

	it("should not fail on invalid callback", (done) =>
	{
		messageBus.registerHandler("test.event", 1);
		messageBus.registerHandler("test.event", () =>
		{
			done();
		});
		messageBus.emit("test.event");
	})
});