const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </>
  );
};

const Header = ({ name }) => {
  return <h2>{name}</h2>;
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((x) => (
        <Part key={x.id} name={x.name} exercises={x.exercises} />
      ))}
      <Part
        name="All"
        exercises={parts.reduce((s, x) => (s += x.exercises), 0)}
      />
    </>
  );
};

const Part = ({ name, exercises }) => {
  if (name === "All") {
    return (
      <p>
        <b>Total of {exercises} exercises</b>
      </p>
    );
  }
  return (
    <p>
      {name}: {exercises}
    </p>
  );
};

export default Course;
