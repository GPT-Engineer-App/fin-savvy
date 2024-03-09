import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Progress, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaPiggyBank, FaRegListAlt, FaWallet } from "react-icons/fa";

const Index = () => {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [goal, setGoal] = useState("");
  const [goalProgress, setGoalProgress] = useState(0);
  const toast = useToast();

  const handleAddExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses([...expenses, { name: expenseName, amount: parseFloat(expenseAmount) }]);
      setExpenseName("");
      setExpenseAmount("");
    } else {
      toast({
        title: "Error",
        description: "Please fill out both fields for the expense.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateRemainingBudget = () => {
    return parseFloat(income) - calculateTotalExpenses();
  };

  const calculateTimeToGoal = () => {
    const monthlySavings = parseFloat(income) - calculateTotalExpenses();
    return monthlySavings > 0 && parseFloat(goal) > 0 ? Math.ceil(parseFloat(goal) / monthlySavings) : Infinity;
  };

  const updateGoalProgress = () => {
    const progress = (calculateTotalExpenses() / parseFloat(goal)) * 100;
    setGoalProgress(progress > 100 ? 100 : progress);
  };

  const handleSetGoal = () => {
    if (goal && !isNaN(goal)) {
      updateGoalProgress();
    } else {
      toast({
        title: "Invalid Goal",
        description: "Please enter a valid number for your goal.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl" textAlign="center">
          Budget Planner
        </Heading>

        <FormControl id="income">
          <FormLabel>Monthly Income</FormLabel>
          <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="Enter your monthly income" />
        </FormControl>

        <Box as="section">
          <Heading as="h3" size="lg" mb={4}>
            <FaWallet /> Expenses
          </Heading>
          <Flex>
            <Input type="text" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder="Expense name" mr={2} />
            <Input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Amount" mr={2} />
            <Button onClick={handleAddExpense} colorScheme="blue" leftIcon={<FaRegListAlt />}>
              Add Expense
            </Button>
          </Flex>

          <Stack spacing={2} mt={4}>
            {expenses.map((expense, index) => (
              <Flex key={index} justify="space-between" align="center">
                <Text>{expense.name}</Text>
                <Text>${expense.amount.toFixed(2)}</Text>
                <Button size="sm" colorScheme="red" onClick={() => handleRemoveExpense(index)}>
                  Remove
                </Button>
              </Flex>
            ))}
          </Stack>

          <Box mt={4}>
            <Text fontSize="lg">Total Expenses: ${calculateTotalExpenses().toFixed(2)}</Text>
            <Text fontSize="lg" color={calculateRemainingBudget() >= 0 ? "green.500" : "red.500"}>
              Remaining Budget: ${calculateRemainingBudget().toFixed(2)}
            </Text>
          </Box>
        </Box>

        <Box as="section">
          <Heading as="h3" size="lg" mb={4}>
            <FaPiggyBank /> Savings Goal
          </Heading>
          <Flex>
            <Input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Enter your savings goal" mr={2} />
            <Button onClick={handleSetGoal} colorScheme="teal">
              Set Goal
            </Button>
          </Flex>
          <Progress colorScheme="green" size="sm" value={goalProgress} mt={4} />
          <Text mt={2} textAlign="center">
            Goal Progress: {goalProgress.toFixed(0)}%
          </Text>
          <Text mt={2} textAlign="center">
            Time to Goal: {isFinite(calculateTimeToGoal()) ? `${calculateTimeToGoal()} month(s)` : "Unable to calculate with current income and expenses"}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
