# Lottery
smart contract

-Project description

it will be a lottery where a user can buy a number of tickets and for each ticket purchased they can select 3 numbers (from 0-25). Each ticket costs 1 NLIFE (which will be able to be changed by the contract owner). Whenever someone purchases a ticket, the contract splits the funds it receives. 7.6923% goes to the project wallet, 92.3077% goes to the lottery pot.

Every time nobody wins the lottery, the NLIFE stays in the contract. There are 2 win categories: Jackpot (getting all 3 numbers) and Runner Up (getting 2 of the 3 numbers), the payouts for each are as follows:

- 100% of the pot if they get the Jackpot (split among players if multiple people get the Jackpot)
- 20% of the pot if they get the Runner Up (split among players if multiple people get the Runner Up)

If there is a Jackpot winner and a Runner Up winner at the same time, then:
- 80% of the pot for the Jackpot (split among players if multiple people get the Jackpot)
- 20% of the pot for the Runner Up (split among players if multiple people get the Runner Up)


The lottery numbers will be drawn daily, and numbers will be generated using chainlink's VRF if there is at least 1 user who purchased a ticket that day.
