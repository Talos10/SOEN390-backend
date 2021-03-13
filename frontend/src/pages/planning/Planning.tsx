import { Container, Card } from '../../components';
import './Planning.scss';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import { useEffect, useState } from 'react';

import { API_EVENTS, API_GOALS } from '../../utils/api';

interface Event {
  id: number,
  date: string,
  time: string,
  title: string,
}

interface Goal {
  id: number,
  completed: boolean,
  targetDate: string,
  title: string
}

export default function Planning() {
  const [events, setEvents] = useState<Event[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const getEvents = async () => {
    const request = await fetch(API_EVENTS, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const events = response.message as Event[];
    events.forEach(function (event) {
      event.date = event.date.substring(0,10); // find a better way to do this
    });
    setEvents(events);
  };

  const getGoals = async () => {
    const request = await fetch(API_GOALS, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const goals = response.message as Goal[];
    goals.forEach(function (goal) {
      goal.targetDate = goal.targetDate.substring(0,10); // find a better way to do this
    });
    console.log(goals);
    setGoals(goals);
  };

  const handleCheckboxTick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoals(
      goals.map(goal =>
        goal.id === Number(event.target.value) ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  useEffect(() => {
    getGoals();
    getEvents();
  }, []);

  return (
    <Container title="Planning" className="Planning">
      <div className="planning_top">
        <h1 className="title table_title">Events</h1>
        <div className="planning_top_buttons">
          <Button
            className="add_event_button"
            color="primary"
            variant="contained"
            component={Link}
            to="/planning/add-event">
            Add Event
          </Button>
          <Button color="primary" variant="contained" component={Link} to="/planning/add-goal">
            Add Goal
          </Button>
        </div>
      </div>
      <Card className="table_title">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="name">{event.date}</td>
                <td>{event.time}</td>
                <td>{event.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="planning_top">
        <h1 className="title">Goals</h1>
      </div>
      <Card className="table_title">
        <table>
          <thead>
            <tr>
              <th>Completed</th>
              <th>Target Date</th>
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            {/*Display incomplete goals first*/}
            {goals
              .filter(goal => goal.completed == false)
              .map(goal => (
                <tr key={goal.id}>
                  <td className="name">
                    <Checkbox
                      value={goal.id}
                      checked={goal.completed}
                      onChange={handleCheckboxTick}
                      name="checkedB"
                      color="primary"
                    />
                  </td>
                  <td>{goal.targetDate}</td>
                  <td>{goal.title}</td>
                </tr>
              ))}
            {/* Display completed goals at end */}
            {goals
              .filter(goal => goal.completed == true)
              .map(goal => (
                <tr key={goal.id} className="goal_completed">
                  <td className="name">
                    <Checkbox
                      value={goal.id}
                      checked={goal.completed}
                      onChange={handleCheckboxTick}
                      name="checkedB"
                      color="primary"
                    />
                  </td>
                  <td>{goal.targetDate}</td>
                  <td>{goal.title}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}
