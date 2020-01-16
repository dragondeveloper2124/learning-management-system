import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];

  constructor(
    private apollo: Apollo
  ) { }

  getCourses() {
    const query = gql`
      {
        courses {
          _id
          title
          subtitle
          imageUrl
          createdAt
        }
      }
    `;

    return this.apollo.query({
      query,
      fetchPolicy: 'network-only'
    });
  }

  createCourse(course: Course) {
    const mutation = gql`
      mutation createCourse(
        $title: String!,
        $subtitle: String!,
        $description: String!,
        $image: Upload!,
        $price: Float,
        $sections: [SectionInput!]!
      ) {
          createCourse(courseInput: {
            title: $title,
            subtitle: $subtitle,
            description: $description,
            image: $image,
            price: $price,
            sections: $sections
          }) {
            _id
          }
      }
    `;

    return this.apollo.mutate({
      mutation,
      variables: {...course},
      context: {
        useMultipart: true
      }
    });
  }

  getCourse(id: string) {
    const query = gql`
      query course($id: ID!){
        course(id: $id) {
          _id
          title
          subtitle
          description
          imageUrl
          price
          rating
          sections {
            title
            lectures {
              _id
              title
              videoUrl
              duration
              isFree
            }
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.query({
      query,
      variables: {id},
      fetchPolicy: 'network-only'
    });
  }

  updateCourse(id: string, course: Course) {
    const mutation = gql`
      mutation updateCourse(
        $id: ID!,
        $title: String!,
        $subtitle: String!,
        $description: String!,
        $image: Upload,
        $price: Float,
        $sections: [SectionInput!]!
      ) {
        updateCourse(
          id: $id,
          courseInput: {
            title: $title,
            subtitle: $subtitle,
            description: $description,
            image: $image,
            price: $price,
            sections: $sections
          }) {
            _id
            title
            subtitle
            description
            imageUrl
            rating
            price
            sections {
              title
              lectures {
                _id
                title
                videoUrl
                duration
                isFree
              }
            }
          }
      }
    `;

    return this.apollo.mutate({
      mutation,
      variables: {...course},
      context: {
        useMultipart: true
      }
    });
  }

  deleteCourse(id: string) {
    const mutation = gql`
      mutation deleteCourse(
        $id: ID!
      ) {
          deleteCourse(id: $id)
      }
    `;

    return this.apollo.mutate({
      mutation,
      variables: {
        id
      }
    });
  }
}