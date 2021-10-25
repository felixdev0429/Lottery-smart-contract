const NLIFE = artifacts.require("NLIFE");
const Lottery = artifacts.require("Lottery");

const { assert } = require("chai");
const { BN } = require("web3-utils");
const timeMachine = require('ganache-time-traveler');

contract("Lottery", (accounts) => {
    let nlife_contract, lottery_contract;

    before(async () => {
        await NLIFE.new(
            { from: accounts[0] }
        ).then((instance) => {
            nlife_contract = instance;
        });

        await Lottery.new(
            nlife_contract.address,
            accounts[9],
            new BN('1000'),
            "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
            { from: accounts[0] }
        ).then((instance) => {
            lottery_contract = instance;
        });

        
        let balance = await web3.eth.getBalance(accounts[0]);
        console.log(balance);
        await nlife_contract.transfer(accounts[1], new BN('10000'), { from: accounts[0] }); 
        await nlife_contract.transfer(accounts[2], new BN('10000'), { from: accounts[0] }); 
        await nlife_contract.transfer(accounts[3], new BN('10000'), { from: accounts[0] }); 

        await nlife_contract.approve(lottery_contract.address, new BN('100000'), { from: accounts[0] });
        await nlife_contract.approve(lottery_contract.address, new BN('100000'), { from: accounts[1] });
        await nlife_contract.approve(lottery_contract.address, new BN('100000'), { from: accounts[2] });
        await nlife_contract.approve(lottery_contract.address, new BN('100000'), { from: accounts[3] });

        await lottery_contract.toggleLottery({ from: accounts[0] });
    });

    describe("Buy Tickets", () => {
        it("Buying tickets is not working with no ticket list", async () => {
            let thrownError;
            try {
                await lottery_contract.buyTickets(
                    [],
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Lottery: Ticket list is 0',
            )
        });

        it("Buying tickets is not working with incorrect numbers", async () => {
            let thrownError;
            try {
                await lottery_contract.buyTickets(
                    [[23, 26, 10], [25, 23, 10]],
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Lottery: Lottery number must be less than 25',
            )
        });


        it("Buying tickets is working", async () => {

            await lottery_contract.buyTickets(
                [[17, 9, 5], [3, 5, 8], [11, 11, 13]],
                { from: accounts[3] }
            );
            assert.equal(new BN(await nlife_contract.balanceOf(accounts[9])).toString(), new BN('230').toString());
            assert.equal(new BN(await nlife_contract.balanceOf(lottery_contract.address)).toString(), new BN('2770').toString());
            
        });
    });

    describe("Draw Lottery", () => {
        it("Drawing lottery is not working without correct time to draw", async () => {
            let thrownError;
            try {
                await lottery_contract.drawLottery(
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }

            assert.include(
                thrownError.message,
                'Lottery: Not ready to close to lottery yet',
            )
        });


        it("Drawing lottery is working", async () => {
            await timeMachine.advanceTimeAndBlock(86400);

            assert.equal(new BN(await nlife_contract.balanceOf(accounts[3])).toString(), new BN('7000').toString());
            assert.equal(new BN(await nlife_contract.balanceOf(lottery_contract.address)).toString(), new BN('2770').toString());

            await lottery_contract.declareWinner([3, 5, 8],
                { from: accounts[5] }
            );

            assert.equal(new BN(await nlife_contract.balanceOf(accounts[3])).toString(), new BN('9770').toString());
            assert.equal(new BN(await nlife_contract.balanceOf(lottery_contract.address)).toString(), new BN('0').toString());

        });
    });
});