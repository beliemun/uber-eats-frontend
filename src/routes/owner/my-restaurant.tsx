import { useQuery, useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Dish } from "../../components/dish";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDER_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";
import { pendingOrder } from "../../__generated__/pendingOrder";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantFragment
        menu {
          ...DishFragment
        }
        orders {
          ...OrderFragment
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

const PENDING_ORDER_SUBSCRIPTION = gql`
  subscription pendingOrder {
    pendingOrder {
      ...FullOrderFragment
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const { data: subscriptionData } = useSubscription<pendingOrder>(
    PENDING_ORDER_SUBSCRIPTION
  );
  useEffect(() => {
    if (subscriptionData?.pendingOrder.id) {
      navigate(`/orders/${subscriptionData.pendingOrder.id}`);
    }
  }, [subscriptionData, navigate]);
  const { id } = useParams() as IParams;
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: { input: { id: +id } },
    }
  );
  return (
    <div>
      <div
        className="bg-gray-800 bg-cover bg-center py-12"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-4 pl-20">
          <h4 className="text-2xl mb-2">
            {data?.myRestaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light mb-1">
            {data?.myRestaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.myRestaurant.restaurant?.address}
          </h6>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex-col py-10">
          <Link
            to={`add-dish`}
            className="text-white bg-gray-800 py-4 px-8 mr-8"
          >
            Add Dish &rarr;
          </Link>
          <Link to={"#"} className="text-white bg-rose-500 py-4 px-8">
            Buy Promotion &rarr;
          </Link>
        </div>
        {data?.myRestaurant.restaurant?.menu.length === 0 ? (
          <div className="text-sm text-gray-500">
            <h4>Please upload a dish!</h4>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data?.myRestaurant.restaurant?.menu.map((dish) => (
              <Dish dish={dish} key={dish.id} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="font-bold text-4xl text-green-400 my-6">Sales</h2>
        <VictoryChart
          height={300}
          theme={VictoryTheme.material}
          width={window.innerWidth}
          domainPadding={50}
          containerComponent={<VictoryVoronoiContainer />}
        >
          <VictoryLine
            labels={({ datum }) => datum.y}
            labelComponent={
              // renderInPortal 내부 컴포넌트로 넣어서 안짤리게 보이게 할 때 사용
              <VictoryLabel style={{ fontSize: 20 }} renderInPortal dy={-15} />
            }
            data={data?.myRestaurant.restaurant?.orders.map((order) => ({
              x: order.createdAt,
              y: order.total,
            }))}
            interpolation={"natural"}
            style={{ data: { strokeWidth: 5, stroke: "green" } }}
          />
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: 16,
                fontWeight: 600,
                wordSpacing: -3,
                angle: 30,
                fill: "#00000060",
              },
            }}
            tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
          />
        </VictoryChart>
      </div>
    </div>
  );
};
