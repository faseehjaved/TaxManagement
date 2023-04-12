import React, { useState } from "react";
import schema from "../schemas/schema";
import { Formik, useFormik } from 'formik'
import getItems from "../services/items.service";



const TaxForm = () => {

  const [items] = useState(getItems());
  const [category, setCategory] = useState([]);
  const formik = useFormik({
    initialValues: {
      applicableItems: [],
      name: "",
      ratio: 0,
      appliedTo: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log({
        applicable_items: values.applicableItems,
        name: values.name,
        ratio: values.ratio,
        applied_to: values.appliedTo
      });
    }
  })

  let getItemsWithCategoryNames = (category) => {
    return items.filter(i => i.category?.name === category)
  }
  let getCategoryCheckedState = (cat) => {
    let flag = true;
    getItemsWithCategoryNames(cat).forEach((c) => {
      if (!formik.values.applicableItems.includes(c.id)) {
        flag = false;
      }
    });
    return flag;
  }

  useState(() => {
    let set = new Set();
    for (let i in items) {
      set.add(items[i].category?.name);
    }
    let arr = Array.from(set);
    arr.sort();
    setCategory(arr);
  }, [])

  return (
    <div className="container">
      <h3>Add Tax</h3>
      <Formik enableReinitialize>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="name">
              <input type="text" name="name" onChange={formik.handleChange} />
              {formik.errors.name && formik.touched.name &&
                <div style={{color:'red'}}>{formik.errors.name}</div>
              }
            </div>

            <div className="ratio">
              <input type="number" name="ratio" onChange={(e) => { formik.values.ratio = e.target.value / 100 }} />
              {formik.errors.ratio && formik.touched.ratio &&
                <div style={{color:'red'}}>{formik.errors.name}</div>
              }
            </div>
          </div>

          <div>
            <label>
              <input type="radio" name="appliedTo" value="all" checked={formik.values.applicableItems.length === items.length} onClick={(e) => {
                formik.values.appliedTo = e.target.value;
                formik.setFieldValue(
                  "applicableItems",
                  items.map((i) => i.id)
                );
              }}
                onChange={formik.handleChange}
              />
              Applied to all items in collection
            </label>
          </div>
          <div>
            <label>
              <input type="radio" name="appliedTo" value="some" checked={formik.values.applicableItems.length !== items.length} onClick={(e) => {
                formik.values.appliedTo = e.target.value;
                formik.setFieldValue(
                  "applicableItems", [])
              }}
                onChange={formik.handleChange}
              />
              Apply to specific items
            </label>
          </div>

          <hr />

          {category.map((cat, index) => {
            return (
              <div key={index} className="category">
                <label>
                  <input
                    type="checkbox"
                    name="applicableCategory"
                    value={cat}
                    checked={getCategoryCheckedState(cat)}
                    onChange={
                      (e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          let it = getItemsWithCategoryNames(cat).map((v) => v.id);
                          formik.setFieldValue('applicableItems', formik.values.applicableItems.concat(it));
                        } else {
                          let it = getItemsWithCategoryNames(cat).map((v) => v.id);
                          formik.values.applicableItems = formik.values.applicableItems.filter(ai => !it.includes(ai))
                          formik.setFieldValue('applicableItems', formik.values.applicableItems);
                        }
                      }}
                  />
                  {cat}
                  {getItemsWithCategoryNames(cat).map((item) => (
                    <div key={item.id}>
                      <label>
                        <input
                          type="checkbox"
                          name="applicableItems"
                          value={item.id}
                          checked={formik.values.applicableItems.includes(item.id)}
                          onChange={
                            (e) => {
                              const isChecked = e.target.checked;
                              const { applicableItems } = formik.values;
                              if (isChecked) {
                                applicableItems.push(item.id)
                                formik.setFieldValue('applicableItems', applicableItems);
                              } else {
                                formik.setFieldValue('applicableItems', applicableItems.filter((id) => id !== item.id))
                              }
                            }}
                        />
                        {item.name}
                      </label>
                    </div>
                  ))}
                </label>
              </div>
            )
          })}

          <div className="row">
            <button type="submit">Apply Tax to {formik.values.applicableItems.length} items(s)</button>
          </div>
        </form>
      </Formik>
    </div>
  );
};

export default TaxForm;
