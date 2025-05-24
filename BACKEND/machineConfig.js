const machineNodeMap = {
  babyMaker: {
    endpoint: "opc.tcp://localhost:4840",
    nodes: {
      rotations: "ns=1;s=BabyMaker.Rotations",
      material: "ns=1;s=BabyMaker.Material"
    }
  },
  controlPlug: {
    endpoint: "opc.tcp://localhost:4841",
    nodes: {
      voltage: "ns=1;s=ControlPlug.Voltage",
      tolerance: "ns=1;s=ControlPlug.Tolerance"
    }
  },
  robot: {
    endpoint: "opc.tcp://localhost:4842",
    nodes: {
      movementSpeed: "ns=1;s=Robot.MovementSpeed",
      gripForce: "ns=1;s=Robot.GripForce"
    }
  }
};

module.exports = machineNodeMap;
