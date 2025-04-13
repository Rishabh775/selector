import Select from "./Component/Select";

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-72">
        <Select
          options={[
            {
              value: "data-curation",
              label: "Data curation",
              description: "Managing and organizing data.",
            },
            {
              value: "funding-acquisition",
              label: "Funding acquisition",
              description: "Securing financial support.",
            },
            {
              value: "formal-analysis",
              label: "Formal analysis",
              description: "Statistical analysis of data.",
            },
          ]}
          extended
          isMultiple
          maxSelections={3}
          isClearable
          placeholder="Select roles..."
          onChange={(val) => console.log(val)}
        />
      </div>
    </div>
  );
}

export default App;
